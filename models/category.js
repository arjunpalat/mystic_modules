const mongoose = require('mongoose');

/* Schema for categories */
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    image: {
        type: String,
        default: null,
    },
    description: {
        type: String,
        default: null,
    },
    taxApplicability: {
        type: Boolean,
        default: false,
    },
    tax: {
        type: Number,
        default: 0,
    },
    taxType: {
        type: String,
        default: 'percentage',
    },
});

/* Transform the returned object */
categorySchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

module.exports = mongoose.model('Category', categorySchema);