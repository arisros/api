import request from 'request'
import jsonServer from 'json-server'
import bodyParser from 'body-parser'
import { savePasar, saveListDataPasar, saveLantai, saveEachLantai } from './src/api/pasar.js'
import * as config from './config/main.js'

const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

server.use( bodyParser.json() )
server.use( bodyParser.urlencoded({ extended: true }) )

server.get('/v1/dashboard', (req,res) => {
  console.log(req)
  let data = {
    code: 0,
    errors: [],
    items: [
      {
        pendapatan: 502300200,
        pendapatan_diterima: 253403300,
        pendapatan_belum: 232020200,
        daftar_penyewa: 232,
        produk: 'harian',
        tahun: 2017,
        type: 'month',
        type: 'days',
        data: [53000, 23100, 41200, 31200, 53000, 23100, 41200, 31200, 53000, 23100, 41200, 31200]
        // data: [53000, 23300, 41200, 31500, 53000, 23100, 11200, 31200, 53000, 93100, 31200, 11200, 33000, 23100, 41200, 31200, 53000, 23100, 41200, 31200, 53000, 23100, 41200, 31200, 53000, 23100, 41200, 31200, 53000, 23100, 41200, 31200]
      }
    ]
  }
  res.jsonp(data)
})

server.post('/v1/pasars', (req,res) => {
  console.log(req.headers, req.body, req.body.nama)
  res.jsonp('done')
})

server.post('/v1/pasars', (req, res) => {
  setTimeout(() => {
    savePasar(req.body)
      .then((data, message) => {
        res.jsonp(data)
      })
  }, config.tiemout)
})

server.put('/v1/pasars/:id', (req, res) => {
  setTimeout(() => {
    updatePasar(req.body)
      .then((data, message) => {
        res.jsonp(data)
      })
  }, config.tiemout)
})


server.get('/v1/pasars/kelas-pasar', (req, res) => {
  request.get({url: config.devServer + '/v1/kelas-pasar'}, (err, httpResponse, body) => {
    res.jsonp(JSON.parse(body))
  })
})

server.get('/v1/pasars/pengelola', (req, res) => {
  request.get({url: config.devServer + '/v1/pengelola'}, (err, httpResponse, body) => {
    res.jsonp(JSON.parse(body))
  })
})

server.get('/v1/pasars', (req, res) => {
  request.get({url: config.devServer + '/v1/data-pasar'}, (err, httpResponse, body) => {
    res.jsonp(JSON.parse(body))
  })
})

server.get('/v1/pasars/:id', (req, res) => {
  request.get({url: config.devServer + '/v1/data-pasar/' + req.params.id}, (err, httpResponse, body) => {
    res.jsonp(JSON.parse(body))
  })
})

server.get('/v1/areas/provinsi', (req, res) => {
  request.get({url: config.devServer + '/v1/provinsi'}, (err, httpResponse, body) => {
    res.jsonp(JSON.parse(body))
  })
})

server.get('/v1/areas/child', (req, res) => {
  request.get({url: config.devServer + '/v1/child'}, (err, httpResponse, body) => {
    res.jsonp(JSON.parse(body))
  })
})


server.get('/v1/areas/child/:id', (req, res) => {
  request.get({url: config.devServer + '/v1/child'}, (err, httpResponse, body) => {
    res.jsonp(JSON.parse(body))
  })
})

server.get('/v1/pasars/wilayah-bagian/:id', (req, res) => {
  request.get({url: config.devServer + '/v1/wilayah-bagian?id_kota=' + req.params.id}, (err, httpResponse, body) => {
    res.jsonp(JSON.parse(body))
  })
})

server.get('/v1/units/:id_lantai', (req, res) => {
  setTimeout(() => {
    request.get({url: config.devServer + '/v1/unit?id_lantai='+req.params.id_lantai}, (err, httpResponse, body) => {
      res.jsonp(JSON.parse(body))
    })
  },config.timeout)
})

server.delete('/v1/units/:id', (req, res) => {
  setTimeout(() => {
    request.delete({url: config.devServer + '/v1/unit/' + req.params.id}, (err, httpResponse, body) => {
      let response = 'Unit berhasil dihapus'
      res.jsonp(response)
    })
  },config.timeout)
})

server.post('/v1/units', (req, res) => {
  setTimeout(() => {
    if (req.headers.authorization !== 'Bearer v2BIGKl1LrVxbz4OvT55cIaqpj1QAIz') {
      let errorResonse = {message: 'Gagal Autentifikasi'}
      res.setHeader('Content-Type', 'text/html')
      res.setHeader('X-Foo', 'bar')
      res.writeHead(401, { 'Content-Type': 'text/plain' })
      res.end(errorResonse.toString())
    } else {
      saveTempatUsaha(req.body).then((data) => {
        // console.log('success')
        res.jsonp(data)
      })
    }
  },config.timeout)
})

const saveTempatUsaha = (value) => {
  return new Promise((resolve, reject) => {
    let stringValue = JSON.stringify(value)
    let use = JSON.parse(stringValue)

    findTipeTempatUsaha(value.tipe_tempat_usaha)
      .then((e) => {
        let data = JSON.parse(e)
        use.tipe_dagang = data.nama
        use.kode_tipe_dagang = data.kode_tempat_usaha
      })
      .then(() => {
        findJenisDagang(value.jenis_dagang)
        .then((e) => {
          let data = JSON.parse(e)
          use.jenis_usaha = data.nama
          request.post({url: config.devServer + '/v1/unit', form: use}, (err, httpResponse, body) => {
            if (err) {
              reject('error', err)
            }
            console.log(httpResponse)
            resolve(body)
          })
        })
      })
  })
}

const findTipeTempatUsaha = (id) => {
  let requestId = parseInt(id)
  return new Promise((resolve, reject) => {
    request.get({url: config.devServer + '/v1/tempat-usaha/' + requestId}, (err, httpResponse, body) => {
      if(err) reject('error')
      resolve(body)
    })
  })
}

const findJenisDagang = (id) => {
  let requestId = parseInt(id)
  return new Promise((resolve, reject) => {
    request.get({url: config.devServer + '/v1/jenis-usaha/' + requestId}, (err, httpResponse, body) => {
      if(err) reject('error')
      resolve(body)
    })
  })
}

server.use(middlewares)
server.use('/v1', router)

server.listen(config.port, () => {
  console.log('JSON Server is running on ' + config.port)
})