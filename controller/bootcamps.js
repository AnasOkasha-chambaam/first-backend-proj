exports.getAllBootcamps = (requ, resp, next) => {
  // console.log(requ);
  resp.status(200).json({
    success: true,
    msg: `Show the all bootcamps...`,
    anyT: requ.anyThing
  })
}

exports.getOneBootcamp = (requ, resp, next) => {
  // console.log(requ);
  resp.status(200).json({
    success: true,
    msg: `Show the bootcamp of the id ${requ.params.id} ...`,
    anyT: `${requ.anyThing} two...`
  })
}

exports.addOneBootcamp = (requ, resp, next) => {
  // console.log(requ);
  resp.status(200).json({
    success: true,
    msg: `Add a bootcamp`
  })
}

exports.updateOneBootcamp = (requ, resp, next) => {
  // console.log(requ);
  resp.status(200).json({
    succuess: true,
    msg: `Update the bootcamp of the id ${requ.params.id}`
  })
}

exports.deleteOneBootcamp = (requ, resp, next) => {
  // console.log(requ);
  resp.status(200).json({
    success: true,
    msg: `Delete the bootcamp of the id ${requ.params.id}`
  })
}