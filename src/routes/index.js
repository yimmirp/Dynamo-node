const express = require('express');
const router = express.Router();
const awskeys = require("../config");
const AWS = require("aws-sdk");
const context = new AWS.DynamoDB.DocumentClient(awskeys.dynamodb);
const db = new AWS.DynamoDB(awskeys.dynamodb);
var uuid = require('uuid');


router.get('/', async (req, res) => {
  /*
    try {
      const params = {
        TableName:"Estudiantes",
        KeyConditionExpression:"carnet = :carnetusuario",
        ExpressionAttributeValues:{
          ":carnetusuario": "201503470"
        }
      }
      const result = await context.query(params).promise();
      console.log(result);
  
    } catch (error) {
      console.log(error)
    }
   */

  res.render('newStudent', { title: 'First Web Node' });
});

router.get('/newCourse', (req, res) => {
  res.render('newCourse', { title: 'Contact Page' });
});

router.get('/asignacion', async (req, res) => {
  let EstudiantesResults = [];
  let CursosResults = [];
  try {
    let params = {
      TableName: "Estudiantes",
    };


    let items = [];
    do {
      items = await db.scan(params).promise();
      items.Items.forEach((item) => EstudiantesResults.push(item));
      params.ExclusiveStartKey = items.LastEvaluatedKey;
    } while (typeof items.LastEvaluatedKey !== "undefined");

    console.log("Estudiantes: ", EstudiantesResults)


    //res.json(scanResults)
  } catch (error) {
    console.error(error);
  }

  try {
    let paramscursos = {
      TableName: "Cursos",
    };


    let itemscursos = [];
    do {
      itemscursos = await db.scan(paramscursos).promise();
      itemscursos.Items.forEach((itemscursos) => CursosResults.push(itemscursos));
      paramscursos.ExclusiveStartKey = itemscursos.LastEvaluatedKey;
    } while (typeof itemscursos.LastEvaluatedKey !== "undefined");

    console.log("Cursos: ", CursosResults)
  } catch (error) {
    console.error(error);

  }



  res.render('asignacion', { Estudiantes: EstudiantesResults, Cursos: CursosResults });
});

router.get('/listadoCurso', async (req, res) => {
  let Cursos = [];
  let Data = [];
  try {
    let params = {
      TableName: "Cursos",
      ProjectionExpression: "codigo, nombrecurso",
    };


    let items = [];
    do {
      items = await db.scan(params).promise();
      items.Items.forEach((item) => Cursos.push(item));
      params.ExclusiveStartKey = items.LastEvaluatedKey;
    } while (typeof items.LastEvaluatedKey !== "undefined");

    console.log("Cursos: ", Cursos)


    //res.json(scanResults)
  } catch (error) {
    console.error(error);
  }

  try {
    let paramscursos = {
      TableName: "Asignacion",
    };


    let itemscursos = [];
    do {
      itemscursos = await db.scan(paramscursos).promise();
      itemscursos.Items.forEach((itemscursos) => Data.push(itemscursos));
      paramscursos.ExclusiveStartKey = itemscursos.LastEvaluatedKey;
    } while (typeof itemscursos.LastEvaluatedKey !== "undefined");

    console.log("Asignacion: ", Data)
  } catch (error) {
    console.error(error);

  }


  res.render('listadocurso', { Cursos: Cursos, Listado: Data });
});



router.post('/endpoint/newStudent', async (req, res) => {
  const { carnet, cui, nombre, dob, correo } = req.body;
  console.log(carnet, cui, nombre, dob, correo)
  var params = {
    TableName: "Estudiantes",
    Item: {
      carnet: { S: carnet },
      cui: { S: cui },
      nombre: { S: nombre },
      dob: { S: dob },
      correo: { S: correo }
    }
  };

  try {
    db.putItem(params, function (err, data) {
      if (err) {
        console.error(err);
      }
      else {
        console.log("------")
        console.log(data);
      }
    });
    res.status(200).json("todo bien");
  } catch (error) {
    console.log(error)
    res.status(401).json("todo mal");
  }

});

router.post('/endpoint/newCourse', async (req, res) => {


  const { codigo, name, creditosn, creditoso } = req.body;
  console.log(codigo, name, creditosn, creditoso)
  var params = {
    TableName: "Cursos",
    Item: {
      codigo: { S: codigo },
      nombrecurso: { S: name },
      creditosnecesarios: { S: creditosn },
      creditosotorgados: { S: creditoso }
    }
  };

  try {
    db.putItem(params, function (err, data) {
      if (err) {
        console.error(err);
      }
      else {
        console.log("------")
        console.log(data);
      }
    });
    res.status(200).json("todo bien");
  } catch (error) {
    console.log(error)
    res.status(401).json("todo mal");
  }

})

router.post('/endpoint/newAsignacion', async (req, res) => {
  const { student, curso, periodo } = req.body;
  console.log(student, curso, periodo)

  var params = {
    TableName: "Asignacion",
    Item: {
      CodigoAsisgnacion: { S: uuid.v1() },
      Estudiante: { S: student },
      CodCurso: { S: curso },
      Periodo: { S: periodo }
    }
  };

  try {
    db.putItem(params, function (err, data) {
      if (err) {
        console.error(err);
      }
      else {
        console.log("------")
        console.log(data);
      }
    });
    res.status(200).json("todo bien");
  } catch (error) {
    console.log(error)
    res.status(401).json("todo mal");
  }
  // res.status(201).json("todo mal");
});

router.post("/endpoint/searchByStudent",async (req,res)=>{
  const { curso } =req.body;
  console.log(curso)

})

module.exports = router;
