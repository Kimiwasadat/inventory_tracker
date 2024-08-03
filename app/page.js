"use client"; // Add this line at the very top

import Image from "next/image";
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
  const [incrementValues, setIncrementValues] = useState({});

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

  const handleIncrementChange = (item, value) => {
    setIncrementValues(prev => ({ ...prev, [item]: value }));
  };

  const getIncrementValue = (item) => {
    return incrementValues[item] ? parseInt(incrementValues[item]) || 1 : 1;
  };

  const addItem = async (item) => {
    if (!item) {
      alert("Item name cannot be empty");
      return;
    }
    const increment = getIncrementValue(item);
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + increment });
    } else {
      await setDoc(docRef, { quantity: increment });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    if (!item) {
      alert("Item name cannot be empty");
      return;
    }
    const decrement = getIncrementValue(item);
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity <= decrement) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - decrement });
      }
    }
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Container maxWidth="md">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Image src="/logo.png" alt="Logo" width={150} height={150} />
        <Image src="/logo.png" alt="Logo" width={150} height={150} />
      </Box>
      <AppBar position="static" color="primary">
        <Toolbar className="toolbar">
          <Typography variant="h6" component="div" className="appbar-title">
            JinishJatra
          </Typography>
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
            className="search-button"
            onClick={() => {
              searchItem(searchItemName);
              handleClose();
            }}
          >
            Search
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            className="add-item-button"
            onClick={handleOpen}
          >
            Add Item
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
        <Box className="inventory-header">
          <Typography variant="body1" align="center">Name of Item</Typography>
          <Typography variant="body1" align="center">Amount of Item</Typography>
          <Typography variant="body1" align="center">Increment</Typography>
          <Typography variant="body1" align="center">Actions</Typography>
        </Box>
        <Stack spacing={2}>
          {inventory.map(({ name, quantity }) => (
            <Box key={name} className="inventory-item">
              <Typography variant="h6" className="item-name" align="center">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="body1" className="item-quantity" align="center">
                {quantity}
              </Typography>
              <TextField
                className="increment-input"
                type="number"
                defaultValue={1}
                inputProps={{ min: 1 }}
                onChange={(e) => handleIncrementChange(name, e.target.value)}
              />
              <Stack direction="row" spacing={2} justifyContent="center">
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => addItem(name)}
                >
                  Add
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => removeItem(name)}
                >
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
      {searchResult && <Typography variant="h5" mt={4} align="center">{searchResult}</Typography>}
    </Container>
  );
}
