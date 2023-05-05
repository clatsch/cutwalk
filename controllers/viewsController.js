const Shipment = require('../models/shipmentModel');
const Customer = require('../models/customerModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getShipments = catchAsync(async(req, res, next) => {
  // 1) Get shipments data from collection
  const shipments = await Shipment.find();
  // 2) Build template

  // 3) Render that template using data from 1)
  res.status(200)
    .render('shipments', {
      title: 'Shipments Overview',
      shipments,
    });
});

exports.getShipment = catchAsync(async(req, res, next) => {
  // 1) Get the data, for the requested shipment
  const shipment = await Shipment.findOne({ _id: req.params.id  });
  const customers = await Customer.find({})

  if (!shipment) {
    return next(new AppError('There is no Shipment with that ID.', 404));
  }

  res.status(200)
    .render('shipment', {
      title: 'Shipment',
      shipment,
      customers,
    });

});

exports.getNewShipment = catchAsync(async(req, res) => {
  const customers = await Customer.find({});
  res.status(200)
    .render('newShipment', {
      title: 'Create new shipment',
      customers,
    });
});

exports.getLoginForm = (req, res) => {
  res.status(200)
    .render('login', {
      title: 'Log into your account',
    });
};

exports.getForgotPasswordForm = (req, res) => {
  res.status(200)
    .render('forgotpassword', {
      title: 'Password Reset',
    });
};

exports.getResetPasswordForm = (req, res) => {
  res.status(200)
    .render('resetpassword', {
      title: 'Password Reset',
    });
};

exports.getSignupForm = (req, res) => {
  res.status(200)
    .render('signup', {
      title: 'Sign up for a new account',
    });
};

exports.getAccount = (req, res) => {
  res.status(200)
    .render('account', {
      title: 'Your account',
    });
};

exports.getCustomers = catchAsync(async(req, res, next) => {
  const customers = await Customer.find();
  res.status(200)
    .render('customers', {
      title: 'Customers',
      customers,
    });
});

exports.getCustomer = catchAsync(async(req, res, next) => {
  // 1) Get the data, for the requested shipment
  const customer = await Customer.findOne({ _id: req.params.id  });
  if (!customer) {
    return next(new AppError('There is no Customer with that ID.', 404));
  }

  res.status(200)
    .render('customer', {
      title: 'Customer',
      customer,
    });
});

exports.getNewCustomer = (req, res) => {
  res.status(200)
    .render('newCustomer', {
      title: 'Create new customer',
    });
};

exports.getUsers = catchAsync(async(req, res, next) => {
  // 1) Get shipments data from collection
  const users = await User.find();
  // 2) Build template

  // 3) Render that template using data from 1)
  res.status(200)
    .render('users', {
      title: 'All Users',
      users,
    });
});

exports.getUser = catchAsync(async(req, res, next) => {
  // 1) Get the data, for the requested shipment
  const user = await User.findOne({ _id: req.params.id  });

  console.log(user);
  if (!user) {
    return next(new AppError('There is no User with that ID.', 404));
  }

  res.status(200)
    .render('user', {
      title: 'User',
      user,
    });
});


