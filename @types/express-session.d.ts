import * as expressSession from 'express-session';
import { File } from 'multer';

declare module 'express-session' {
  interface SessionData {
    userId?: number; // Здесь указывайте, какие данные вы хотите хранить в сессии
    username?: string;
  }
}
declare module 'express' {
  interface Request {
    file?: File;
    session: expressSession.Session & Partial<expressSession.SessionData>;
  }
}
