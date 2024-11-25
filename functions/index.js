const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require("firebase-admin");

const serviceAccount = require("./heroauth-97aa7-firebase-adminsdk-4q4wa-62f9e75caa.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://p161-7ddfd-default-rtdb.europe-west1.firebasedatabase.app"
});

const app = express();

app.use(cors({
  origin: '*'
}));

app.use(bodyParser.json());

const verifyToken = (req, res, next) => {
  const idToken = req.headers.authorization;

  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      req.user = decodedToken;
      next();
    })
    .catch((error) => {
      console.error('Hiba történt a token ellenőrzésekor:', error);
      res.sendStatus(401);
    });
};

const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.admin) {
    next();
  } else {
    res.status(403).json({ message: 'Hozzáférés megtagadva: csak adminok érhetik el ezt az erőforrást.' });
  }
};

app.post('/setCustomClaims', verifyToken, (req, res) => {
  const { uid, claims } = req.body;
  admin
    .auth()
    .setCustomUserClaims(uid, claims)
    .then(() => {
      console.log('Felhasználó claimsek sikeresen beállítva.');
      res.json({ message: 'OK' });
    })
    .catch((error) => {
      console.error('Hiba történt a felhasználó claimsek beállításakor:', error);
      res.sendStatus(500);
    });
});
app.get('/users-with-claims', verifyToken, async (req, res) => {
  try {
    const userRecords = await admin.auth().listUsers();
    const usersWithClaims = await Promise.all(userRecords.users.map(async (user) => {
      const userDetails = await admin.auth().getUser(user.uid);
      return {
        uid: userDetails.uid,
        email: userDetails.email,
        displayName: userDetails.displayName,
        claims: userDetails.customClaims || {},
        minden: {...userDetails},
      };
    }));
    res.json(usersWithClaims);
  } catch (error) {
    console.error('Hiba történt a felhasználók lekérésekor:', error);
    res.sendStatus(500);
  }
});

app.get('/users', verifyToken, (req, res) => {
  admin
    .auth()
    .listUsers()
    .then((userRecords) => {
      const users = userRecords.users.map((user) => ({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        
        minden: {...user}
        // Egyéb felhasználói adatok ......
      }));
      res.json(users);
    })
    .catch((error) => {
      console.error('Hiba történt a felhasználók lekérésekor:', error);
      res.sendStatus(500);
    });
});

app.get('/users/:uid/claims', verifyToken, (req, res) => {
  const { uid } = req.params;
  admin
    .auth()
    .getUser(uid)
    .then((userRecord) => {
      res.json(userRecord.customClaims);
    })
    .catch((error) => {
      console.error('Hiba történt a felhasználó lekérdezésekor:', error);
      res.sendStatus(500);
    });
});
// csak admin
app.get('/ausers/:uid/claims', verifyToken, (req, res) => {
  const { uid } = req.params;
  
  if (!req.user.admin && req.user.uid !== uid) {
    return res.status(403).json({
      message: 'Hozzáférés megtagadva: csak a saját claims adataidat érheted el.',
    });
  }

  admin
    .auth()
    .getUser(uid)
    .then((userRecord) => {
      res.json(userRecord.customClaims);
    })
    .catch((error) => {
      console.error('Hiba történt a felhasználó lekérdezésekor:', error);
      res.sendStatus(500);
    });
});

exports.api = onRequest(app);