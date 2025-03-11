import bcrypt from 'bcrypt';
import Admin from '../../models/admin/adminsModel.js';

const getAdmin = async (req, res, next) => {
  try {
    const id = req.params.id;
    const admin = await Admin.findById(id);

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json({ message: `get admin by id ${id}`, data: admin });
  } catch (error) {
    // next(error);
    res.status(404).json({ message: 'Fail', error: error.message });
  }
};

const registerAdmin = async (req, res, next) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res
        .status(400)
        .json({ message: 'Email and Password is required' });
    }

    const admins = await Admin.findOne({ email: req.body.email });

    if (admins) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    const admin = new Admin({
      email: req.body.email,
      password: hashedPassword,
    });

    await admin.save();

    res.status(201).json({ message: 'success', data: admin });
  } catch (error) {
    res.status(404).json({ message: 'Fail', error: error.message });
    // next(error);
  }
};
const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // if (!email || !password) {
    //   return res
    //     .status(400)
    //     .json({ message: 'Email and Password is required' });
    // }

    const admins = await Admin.findOne({ email: email });

    // const isMatch = await bcrypt.compare(password, admins.password);

    // if (!isMatch) {
    //   return res.status(401).json(null);
    // }
    console.log(admins);
    res.status(201).json(admins);
  } catch (error) {
    // res.status(404).json({ message: 'Fail', error: error.message });
    // next(error);
    return null;
  }
};

const updateAdmin = async (req, res, next) => {
  const { id } = req.params;
  const newAdminData = { ...req.body };
  try {
    const admin = await Admin.findById(id);

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    await Admin.findByIdAndUpdate(id, {
      ...newAdminData,
    });

    res.status(200).json({ message: `Admin updated ${id}` });
  } catch (error) {
    // next(error);
    res.status(404).json({ message: 'Fail', error: error.message });
  }
};

const deleteAdmin = async (req, res, next) => {
  try {
    const id = req.params.id;
    // const admin = await Admin.findByIdAndRemove(id);
    // if (!admin) {
    //   return res.status(404).json({ message: 'Admin not found' });
    // }
    res.status(200).json({ message: `Admin deleted ${id}` });
  } catch (error) {
    // next(error);
    res.status(404).json({ message: 'Fail', error: error.message });
  }
};

export { getAdmin, loginAdmin, registerAdmin, updateAdmin, deleteAdmin };
