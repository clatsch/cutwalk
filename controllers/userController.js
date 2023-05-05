import multer from 'multer';
import sharp from 'sharp';
import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import * as factory from './handlerFactory.js';

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadUserPhoto = upload.single('photo');

export const resizeUserPhoto = (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/users/${req.file.filename}`);

  next();
};

const filterObj = (obj, ...allowedFields) => {
  // loop through all the fields and check if its to be included
  const newObj = {};
  Object.keys(obj)
      .forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
      });
  return newObj;
};

export const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
}

export const updateMe = catchAsync(async(req, res, next) => {

  // 1) Create error ir user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password updates. Please use /updateMyPassword'), 400);
  }
  // 2) Filtered out unwanted fieldnames that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;

  // 3) Update user document
  // filter in order to prevent that password, role etc. could be updated
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200)
      .json({
        status: 'success',
        data: {
          user: updatedUser,
        },
      });
});

export const deleteMe = catchAsync(async(req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204)
      .json({
        status: 'success',
        data: null,
      });
});



export const createUser = (req, res) => {
  res.status(500)
      .json({
        status: 'error',
        message: 'This route is not defined! Please use /signup.ejs instead',
      });
};

export const getAllUsers = factory.getAll(User);
export const getUser = factory.getOne(User);
export const deleteUser = factory.deleteOne(User);

// Do NOT update passwords with this
export const updateUser = factory.updateOne(User);
