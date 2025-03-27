import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Admin from '../../models/admin/adminsModel.js';

const getAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                status: 'error',
                message: 'Admin ID is required'
            });
        }

        const admin = await Admin.findById(id);
        if (!admin) {
            return res.status(404).json({
                status: 'error',
                message: 'Admin not found'
            });
        }

        res.status(200).json({
            status: 'success',
            message: `Admin retrieved successfully`,
            data: {
                id: admin._id,
                email: admin.email,
                name: admin.name,
                role: admin.role
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
            error: error.message
        });
    }
};

const registerAdmin = async (req, res) => {
    try {
        const { email, password, name, role } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Email and password are required'
            });
        }

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(409).json({
                status: 'error',
                message: 'Email already exists'
            });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const admin = new Admin({
            email,
            password: hashedPassword,
            name: name || '',
            role: role || 'admin'
        });

        await admin.save();

        const token = jwt.sign(
            { id: admin._id, email: admin.email, role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            status: 'success',
            message: 'Admin registered successfully',
            data: {
                id: admin._id,
                email: admin.email,
                name: admin.name,
                role: admin.role
            },
            token
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
            error: error.message
        });
    }
};

const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Email and password are required'
            });
        }

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid credentials'
            });
        }

        const isMatch = bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid credentials'
            });
        }

        const token = jwt.sign(
            { id: admin._id, email: admin.email, role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            status: 'success',
            message: 'Login successful',
            data: {
                id: admin._id,
                email: admin.email,
                name: admin.name,
                role: admin.role
            },
            token
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
            error: error.message
        });
    }
};

const updateAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, password, name, role } = req.body;

        if (!id) {
            return res.status(400).json({
                status: 'error',
                message: 'Admin ID is required'
            });
        }

        const admin = await Admin.findById(id);
        if (!admin) {
            return res.status(404).json({
                status: 'error',
                message: 'Admin not found'
            });
        }

        const updateData = { email, name, role };
        if (password) {
            const saltRounds = 10;
            updateData.password = await bcrypt.hash(password, saltRounds);
        }

        const updatedAdmin = await Admin.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            status: 'success',
            message: 'Admin updated successfully',
            data: {
                id: updatedAdmin._id,
                email: updatedAdmin.email,
                name: updatedAdmin.name,
                role: updatedAdmin.role
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
            error: error.message
        });
    }
};

const deleteAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                status: 'error',
                message: 'Admin ID is required'
            });
        }

        // const admin = await Admin.findByIdAndDelete(id);
        // if (!admin) {
        //     return res.status(404).json({
        //         status: 'error',
        //         message: 'Admin not found'
        //     });
        // }

        res.status(200).json({
            status: 'success',
            message: 'Admin deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
            error: error.message
        });
    }
};

export { getAdmin, loginAdmin, registerAdmin, updateAdmin, deleteAdmin };
