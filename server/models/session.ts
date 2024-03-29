import { Model, model, Document, Schema } from 'mongoose';
import { UserSchema, IUserModel } from './user';
import { GameTypes } from '../gameLogic/game';

export interface ISession {
  name: string;
  host: IUserModel;
  gameType: GameTypes
}

export interface ISessionModel extends ISession, Document {}

export const SessionSchema: Schema = new Schema({
  name: String,
  createdAt: Date,
  lastModified: Date,
  gameType: String,
  host: UserSchema
});

SessionSchema.pre('save', function(next) {
  const now = new Date();
  const createdAt = this.get('createdAt', Date);
  if (!createdAt) {
    this.set('createdAt', now);
  }
  this.set('lastModified', now);
  next();
});

export const Session: Model<ISessionModel> = model<ISessionModel>('Session', SessionSchema);
