import { model, Schema, Document } from 'mongoose';

const PollSchema: Schema = new Schema({
    // schema types
});

const PollModel = model< {} & Document>('Poll', PollSchema);// model types

export default PollModel;
