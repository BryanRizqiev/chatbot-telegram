const { dockStart } = require('@nlpjs/basic');

const nlpFunc = async () => {
  const dock = await dockStart({
    settings: {
      nlp: {
        forceNER: true,
        languages: ['id'],
        corpora: [
          "./corpus.json"
        ]
      }
    },
    use: ['Basic']
  })

  const manager = dock.get('nlp')

  manager.registerActionFunction('handleWhatsTimeAction', async (data, locale) => { 
    data.context.time = new Date().toLocaleTimeString(locale)
    data.answer = data.answer.replace("{{ time }}", data.context.time)
    return data
  })

  // bisa save / load
  await manager.train()

  return async (data) => {
    const result = await manager.process('id', data)
    return result
  }
}

const theFunc = async () => {
  return await nlpFunc()
} 

module.exports = theFunc()
