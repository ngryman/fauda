import getopts from 'getopts'
import { promises as fs } from 'fs'
import { generateTypes } from './'

async function main() {
  const parsedArgs = getopts(process.argv, {
    alias: {
      i: 'input',
      o: 'output'
    }
  })

  const command = parsedArgs._[2]
  if (!command) {
    throw new Error('Only the "types" command is supported for now.')
  }

  const { input = 'schema.json', output = 'src/configuration.ts' } = parsedArgs
  const source = await generateTypes(input)
  await fs.writeFile(output, source)
}

main().catch(err => console.log(err.message))
