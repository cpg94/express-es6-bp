
import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const schema = new Schema({ name: 'string', age: 'number' })

export default mongoose.model("Luke", schema)