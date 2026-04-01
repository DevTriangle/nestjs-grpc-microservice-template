import { readdirSync, statSync } from 'fs'
import { join } from 'path'

export function getInitProtoFiles({
  dirPath,
  excludeFiles = [],
}: {
  dirPath: string
  excludeFiles?: string[]
}): [string[], string[]] {
  const projectRoot = __dirname.split('dist')
  const dir = join(projectRoot[0], 'dist', dirPath)

  const [packages, protoPaths] = getProtoFiles({ path: dir, excludeFiles })

  return [Array.from(new Set(packages)), Array.from(new Set(protoPaths))]
}

function getProtoFiles({
  path,
  excludeFiles,
  packageName,
}: {
  path: string
  excludeFiles: string[]
  packageName?: string
}): [string[], string[]] {
  const packages: string[] = []
  const protoPaths: string[] = []

  const dirObjects = readdirSync(path)

  for (const obj of dirObjects) {
    const fullPath = join(path, obj)
    const stat = statSync(fullPath)

    if (stat.isDirectory()) {
      const [nestedPackages, nestedProtoPaths] = getProtoFiles({
        path: fullPath,
        excludeFiles,
        packageName: obj,
      })

      packages.push(...nestedPackages)
      protoPaths.push(...nestedProtoPaths)
    } else if (stat.isFile() && obj.endsWith('.proto') && !excludeFiles.includes(obj)) {
      if (packageName) packages.push(packageName)
      protoPaths.push(fullPath)
    }
  }

  return [packages, protoPaths]
}
