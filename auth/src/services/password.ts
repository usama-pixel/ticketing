import { scrypt, randomBytes } from 'crypto'
import { promisify } from 'util'

const scryptAsync = promisify(scrypt)
export class Password {
    static async toHash(password: string): Promise<string> {
        const salt = randomBytes(8).toString('hex')
        const buf = (await scryptAsync(password, salt, 64)) as Buffer
        return `${buf.toString('hex')}.${salt}`
    }
    static async compare(storedPassword: string, suppliedPassword: string): Promise<boolean> {
        const [p1, salt] = storedPassword.split('.')[0]
        const res = await this.toHash(suppliedPassword)
        const p2 = res.split('.')[0]
        return p1 === p2
    }
}