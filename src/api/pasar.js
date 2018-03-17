import request from 'request'
import * as config from '../../config/main.js'

const savePasar = (value) => {
  return new Promise((resolve, reject) => {
    let stringValue = JSON.stringify(value)

    let savingLantai = saveLantai
    let savingListDataPasar = saveListDataPasar

    var reuse = JSON.parse(stringValue)
    var use = JSON.parse(stringValue)
    var useList = JSON.parse(stringValue)
    
    delete use.lantai
    delete useList.lantai

    useList.jumlah_toko = Math.ceil(Math.random() * (120 - 20) + 20)
    useList.jumlah_kios = Math.ceil(Math.random() * (120 - 20) + 20)
    useList.jumlah_lapak = Math.ceil(Math.random() * (120 - 20) + 20)
    useList.jumlah_meja = Math.ceil(Math.random() * (120 - 20) + 20)
    useList.jumlah_los = Math.ceil(Math.random() * (120 - 20) + 20)
    useList.jumlah_pemilik = Math.ceil(Math.random() * (120 - 20) + 20)

    use.kode_pasar = '02PKL01B01K1B1004'
    use.pengelola = parseInt(use.pengelola)
    use.kelas = parseInt(use.kelas)
    use.wilayah_bagian = parseInt(use.wilayah_bagian)
    use.provinsi = parseInt(use.provinsi)
    use.kabupaten = parseInt(use.kabupaten)
    use.kecamatan = parseInt(use.kecamatan)
    use.kelurahan = parseInt(use.kelurahan)

    let lantai = {}
    request.post({url: config.devServer + '/v1/data-pasar', form: use}, (err, httpResponse, body) => {
      if (err) {
        reject('error', err)
      }
      lantai = JSON.parse(body)
      let data = {
        id: lantai.id,
        nama: lantai.nama
      }
      savingLantai(lantai.id, value.lantai)
      savingListDataPasar(lantai.id, useList, lantai.kode_pasar)
      let message = 'Berhasil menyimpan ' + lantai.nama
      resolve(data, message)
    })
  })
}

const saveListDataPasar = (id, value, kodePasar) => {
  return new Promise((resolve, reject) => {
    value.kode_pasar = kodePasar
    value.id = id
    request.post({url: config.devServer + '/v1/list-data-pasar', form: value}, (err, httpResponse, body) => {
      if (err) {
        reject('error', err)
      }
      resolve('done')
    })
  })
}

const saveLantai = (id, value) => {
  let save = saveEachlantai
  if (value) {
    value.forEach((e,i) => {
      e.id_pasar = id
      save(e)
    })
  }
}

const saveEachlantai = (value) => {
  request.post({url: config.devServer + '/v1/data-lantai', form: value}, (err, httpResponse, body) => {
    if (err) {
      return console.error('upload failed:', err)
    }
  })
}

// module.exports.updatePasar = updatePasar
module.exports.savePasar = savePasar
module.exports.saveListDataPasar = saveListDataPasar
module.exports.saveLantai = saveLantai
module.exports.saveEachlantai = saveEachlantai
