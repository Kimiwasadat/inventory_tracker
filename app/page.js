'use client'
import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { Box, Modal, Typography, Stack, TextField, Button, Container, AppBar, Toolbar, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { collection, deleteDoc, getDocs, query, getDoc, doc, setDoc } from 'firebase/firestore';
import './styles.css'; // Import your CSS file for custom styles

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchResult, setSearchResult] = useState('');
  const [searchItemName, setSearchItemName] = useState('');

  useEffect(() => {
    const updateInventory = async () => {
      const snapshot = query(collection(firestore, 'inventory'));
      const docs = await getDocs(snapshot);
      const inventoryList = [];
      docs.forEach((doc) => {
        inventoryList.push({
          name: doc.id,
          ...doc.data(),
        });
      });
      setInventory(inventoryList);
    };

    // Only run this effect in the client
    if (typeof window !== 'undefined') {
      updateInventory();
    }
  }, []);

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const searchItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      setSearchResult(`${item} found with quantity: ${quantity}`);
    } else {
      setSearchResult(`${item} not found`);
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    } else {
      await setDoc(docRef, { quantity: quantity - 1 });
    }
    await updateInventory();
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Container maxWidth="md">
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Inventory Management
          </Typography>
          <IconButton edge="end" color="inherit" onClick={handleOpen}>
            <AddIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box mt={4} display="flex" alignItems="center" justifyContent="center">
        <Stack direction="row" spacing={2} className="search">
          <TextField 
            label="Search Item"
            variant="outlined" 
            fullWidth
            value={searchItemName}
            onChange={(f) => setSearchItemName(f.target.value)}
          />
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<SearchIcon />}
            onClick={() => {
              searchItem(searchItemName);
              handleClose();
            }}
          >
            Search
          </Button>
        </Stack>
      </Box>
      <Modal open={open} onClose={handleClose}>
        <Box className="modal">
          <Typography variant="h6">Add Item</Typography>
          <Stack direction="row" spacing={2}>
            <TextField 
              label="Add Item"
              variant="outlined" 
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Box mt={4}>
        <Typography variant="h4" gutterBottom>
          Inventory Items
        </Typography>
        <Stack spacing={2}>
          {inventory.map(({ name, quantity }) => (
            <Box key={name} className="inventory-item">
              <Typography variant="h6" className="item-name">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="body1" className="item-quantity">
                Quantity: {quantity}
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button variant="contained" color="secondary" onClick={() => addItem(name)}>
                  Add
                </Button>
                <Button variant="contained" color="error" onClick={() => removeItem(name)}>
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
      {searchResult && <Typography variant="h5" mt={4}>{searchResult}</Typography>}
    </Container>
  );
}
