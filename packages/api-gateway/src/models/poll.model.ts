import { model, Schema, Document } from 'mongoose';
import { IPoll } from '@/interfaces/poll.interface';

const PollSchema: Schema = new Schema({
  pollId: { type: Schema.Types.String },
  question: { type: Schema.Types.String },
  answerOptions: {
    type: Schema.Types.Array,
  },
  answers: {
    type: Schema.Types.Array,
  },
});

const PollModel = model<IPoll & Document>('Poll', PollSchema);

export default PollModel;
