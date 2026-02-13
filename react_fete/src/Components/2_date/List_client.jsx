import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  Box,
  Button,
  Container,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
  Alert,
  Checkbox,
  FormControlLabel,
} from '@mui/material';

function numberToWords(n) {
  const ones = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf'];
  const teens = ['dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
  const tens = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante', 'quatre-vingt', 'quatre-vingt'];

  if (n === 0) return 'zéro';
  if (n < 10) return ones[n];
  if (n < 20) return teens[n - 10];
  if (n < 100) {
    let ten = Math.floor(n / 10);
    let one = n % 10;
    let tenWord = tens[ten];
    if (ten === 7 || ten === 9) return tens[ten] + '-' + teens[one];
    if (one === 1 && ten !== 8) return tenWord + '-et-un';
    if (one > 0) return tenWord + '-' + ones[one];
    return tenWord;
  }
  if (n < 1000) {
    let hundred = Math.floor(n / 100);
    let rest = n % 100;
    let hundredWord = (hundred > 1 ? ones[hundred] + ' cent' : 'cent');
    if (rest === 0) return hundredWord;
    return hundredWord + ' ' + numberToWords(rest);
  }
  if (n < 1000000) {
    let thousand = Math.floor(n / 1000);
    let rest = n % 1000;
    let thousandWord = (thousand > 1 ? numberToWords(thousand) + ' mille' : 'mille');
    if (rest === 0) return thousandWord;
    return thousandWord + ' ' + numberToWords(rest);
  }
  return n.toString();
}

function List_client() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [clients, setClients] = useState([]);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const [selectedClients, setSelectedClients] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('role');
    setIsAdmin(role === 'admin');
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/client/list', {
        params: { start: startDate, end: endDate },
      });
      setClients(response.data);
      setError('');
      setSearched(true);
      setSelectedClients([]);
      setSelectAll(false);
    } catch {
      setError('Erreur lors de la récupération des clients');
      setSearched(false);
    }
  };

  const handleSelectClient = (cin) => {
    setSelectedClients((prev) =>
      prev.includes(cin) ? prev.filter(id => id !== cin) : [...prev, cin]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedClients([]);
    } else {
      const allCINs = clients.map(client => client.cin_client);
      setSelectedClients(allCINs);
    }
    setSelectAll(!selectAll);
  };

  const handleDelete = async () => {
    if (selectedClients.length === 0) return;
    try {
      await axios.post('http://localhost:5000/api/client/delete-multiple', { cins: selectedClients });
      fetchClients();
    } catch {
      console.error('Erreur lors de la suppression');
    }
  };

  const generatePDF = () => {
    if (clients.length === 0) return;

    const pdf = new jsPDF();
    pdf.setFontSize(18);
    pdf.text('Facture', 14, 20);
    pdf.setFontSize(12);
    pdf.text(`Période de: ${startDate} à ${endDate}`, 14, 30);

    const tableColumn = ['CIN', 'Nom', 'Prénom', 'Email', 'PAF (Ar)', 'Date de création'];
    const tableRows = [];
    let totalPaf = 0;

    clients.forEach(client => {
      totalPaf += Number(client.paf_client);
      tableRows.push([
        client.cin_client,
        client.nom_client,
        client.prenom_client,
        client.email_client,
        client.paf_client + ' Ar',
        client.date_creation,
      ]);
    });

    autoTable(pdf, {
      startY: 40,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
    });

    const finalY = pdf.lastAutoTable.finalY + 10;
    pdf.setFontSize(14);
    pdf.text(`Total de participation : ${totalPaf} Ar`, 14, finalY);
    pdf.setFontSize(12);
    pdf.text(`(La somme est arretés à : ${numberToWords(Math.round(totalPaf))} ariary)`, 14, finalY + 10);
    pdf.save('facture_clients.pdf');
  };

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" gutterBottom>
          Liste des clients entre deux dates
        </Typography>

        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="flex-end">
            <Grid item xs={12} sm={5}>
              <TextField
                size="small"
                label="Date de début"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <TextField
                size="small"
                label="Date de fin"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button variant="contained" color="primary" fullWidth onClick={fetchClients}>
                Rechercher
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {error && <Alert severity="error">{error}</Alert>}
        {searched && clients.length === 0 && !error && (
          <Alert severity="info" sx={{ my: 2 }}>Aucun client trouvé dans cette plage de dates.</Alert>
        )}

        {clients.length > 0 && (
          <>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Button variant="outlined" color="secondary" onClick={generatePDF}>
                Générer la facture
              </Button>
              {isAdmin && (
                <Button variant="contained" color="error" onClick={handleDelete}>
                  Supprimer les sélectionnés
                </Button>
              )}
            </Box>

            <Paper>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      {isAdmin && (
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectAll}
                            onChange={handleSelectAll}
                          />
                        </TableCell>
                      )}
                      <TableCell><strong>CIN</strong></TableCell>
                      <TableCell><strong>Nom</strong></TableCell>
                      <TableCell><strong>Prénom</strong></TableCell>
                      <TableCell><strong>Email</strong></TableCell>
                      <TableCell><strong>PAF</strong></TableCell>
                      <TableCell><strong>Date de création</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {clients.map(client => (
                      <TableRow key={client.cin_client}>
                        {isAdmin && (
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedClients.includes(client.cin_client)}
                              onChange={() => handleSelectClient(client.cin_client)}
                            />
                          </TableCell>
                        )}
                        <TableCell>{client.cin_client}</TableCell>
                        <TableCell>{client.nom_client}</TableCell>
                        <TableCell>{client.prenom_client}</TableCell>
                        <TableCell>{client.email_client}</TableCell>
                        <TableCell>{client.paf_client} Ar</TableCell>
                        <TableCell>{client.date_creation}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </>
        )}
      </Box>
    </Container>
  );
}

export default List_client;
