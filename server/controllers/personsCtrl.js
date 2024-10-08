const cars = require("../routes/cars");

module.exports = db => {
  return {
    create: (req, res) => {
      const receivedBody = { ...req.body };
      delete receivedBody.masini;
      db.models.Persons.create(receivedBody)
        .then(async (person) => {
          if (req.body.masini) {
            const cars = await db.models.Cars.findAll({
              where: {
                id: req.body.masini
              }
            });
            person.addCars(cars).then(() => {
              res.send({ success: true });
            }).catch(error => {
              console.error('Eroare la setarea mașinilor:', error);
              res.status(500).send({ error: 'Eroare la setarea mașinilor' });
            });
          } else {
            res.send({ success: true });
          }
        }).catch(error => {
          console.error('Eroare la crearea persoanei:', error);
          res.status(401).send({ error: 'Eroare la crearea persoanei' });
        });
    },

    update: (req, res) => {
      db.models.Persons.update(req.body, {
        where: { id: req.body.id },
        include: [{ model: db.models.Cars }]
      })
        .then(() => {
          db.models.Persons.findByPk(req.body.id).then(person => {
            person.setCars(req.body.masini);
          });
          res.send({ success: true });
        }).catch(() => res.status(401));
    },

    findAll: (req, res) => {
      db.query(`SELECT id, nume, prenume, cnp, varsta
        FROM "Persons"
        ORDER BY id`, { type: db.QueryTypes.SELECT }).then(resp => {
        res.send(resp);
      }).catch(() => res.status(401));
    },

    find: (req, res) => {
      db.query(`SELECT id, nume, prenume, cnp, varsta
        FROM "Persons" WHERE id = ${req.params.id}`, { type: db.QueryTypes.SELECT }).then(resp => {
        res.send(resp[0]);
      }).catch(() => res.status(401));
    },

    destroy: (req, res) => {
      db.query(`DELETE FROM "Persons" WHERE id = ${req.params.id}`, { type: db.QueryTypes.DELETE }).then(() => {
        res.send({ success: true });
      }).catch(() => res.status(401));
    },

  };
};