import * as fs from 'fs';
import * as path from 'path';

export class FileService {
  ensureDir(targetPath: string): void {
    if (!fs.existsSync(targetPath)) {
      fs.mkdirSync(targetPath, { recursive: true });
    }
  }

  writeFile(targetDir: string, relativePath: string, content: Buffer): string {
    const fullPath = path.join(targetDir, relativePath);
    this.ensureDir(path.dirname(fullPath));
    fs.writeFileSync(fullPath, content);
    return fullPath;
  }
}
