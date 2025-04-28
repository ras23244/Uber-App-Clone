const mongoose= require('mongoose');
const bcrypt=require('bcrypt');
const jwt= require('jsonwebtoken');

const captainSchema= new mongoose.Schema({
    fullname:{
        firstname:{
            type:String,
            required:true,
            minlength:[3,"First name should be atleast 3 characters long"],
        },
        lastname:{
            type:String,
            minlength:[3,"Last name should be atleast 3 characters long"],
        }
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,"Please enter a valid email"]
    },
    password:{
        type:String,
        required:true,
        select:false,
        minlength:[6,"Password should be atleast 6 characters long"],
    },
    socketId:{
        type:String,
    },
    status:{
        type:String,
        enum:['active','inactive'],
        default:'inactive'
    },
    vehicle:{
        color:{
            type:String,
            required:true,
            minlength:[3,"Color should be atleast 3 characters long"],
        },
        plate:{
            type:String,
            required:true,
            minlength:[3,"Plate should be atleast 3 characters long"],
        },
        capacity:{
            type:Number,
            required:true,
            min:[1,"Capacity should be atleast 1"],
        },
        vehicleType:{
            type:String,
            required:true,
            enum:['car','bike','auto'],
        }
    },
      
    location:{
        lng:{
            type:Number,
            // required:true,
        },
        ltd:{
            type:Number,
            // required:true,
        }
    }

})

captainSchema.index({ geoLocation: "2dsphere" });
captainSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return token;
}


captainSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}


captainSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
}

const captainModel=mongoose.model('captain',captainSchema);

module.exports=captainModel;