import Position from '../models/Position.js';

/**
 * Controller to create position
 * */
export const createPositionController = async (req, res) => {
    try {
        const position = await Position.findOne({ position: req.body.position });
        if (position) return res.status(400).json({ code: 400, message: 'Vị trí đã tồn tại' });

        const newPosition = new Position(req.body);
        await newPosition.save();

        res.status(200).json({ code: 200, message: 'Tạo vị trí thành công' });
    } catch (err) {
        console.error(`Error in createPositionController: ${err}`);
        res.status(500).json({ code: 500, message: 'Unexpected error' });
    }
};

/**
 * Controller to get position details by positionId
 * */
export const getPositionByIdController = async (req, res) => {
    try {
        const { positionId } = req.params;

        const position = await Position.findById(positionId);

        res.status(200).json({ code: 200, message: 'Success', position });
    } catch (err) {
        console.error(`Error in getPositionByIdController: ${err}`);
        res.status(500).json({ code: 500, message: 'Unexpected error' });
    }
};

/**
 * Controller to get all positions
 * */
export const getAllPositionController = async (req, res) => {
    try {
        let { limit, page } = req.query;
        if (!limit) limit = 5;
        if (!page) page = 1;

        const skip = (page - 1) * limit;

        const positions = await Position.find().sort({ createdAt: -1 }).skip(skip).limit(Number(limit));

        const totalPositions = await Position.countDocuments();

        const totalPages = Math.ceil(totalPositions / limit);

        res.status(200).json({ code: 200, message: 'Success', positions, totalPages });
    } catch (err) {
        console.error(`Error in getAllPositionController: ${err}`);
        res.status(500).json({ code: 500, message: 'Unexpected error' });
    }
};

/**
 * Controller to update position details
 * */
export const updatePositionByIdController = async (req, res) => {
    try {
        const { positionId } = req.params;

        const updated = await Position.findByIdAndUpdate(
            positionId,
            { $set: req.body },
            {
                new: true,
            },
        );

        res.status(200).json({ code: 200, message: 'Cập nhật vị trí thành công', updated });
    } catch (err) {
        console.error(`Error in updatePositionByIdController: ${err}`);
        res.status(500).json({ code: 500, message: 'Unexpected error' });
    }
};

/**
 * Controller to delete position by positionId
 * */
export const deletePositionByIdController = async (req, res) => {
    try {
        const { positionId } = req.params;

        await Position.findByIdAndDelete(positionId);

        res.status(200).json({ code: 200, message: 'Xóa vị trí thành công' });
    } catch (err) {
        console.error(`Error in deletePositionByIdController: ${err}`);
        res.status(500).json({ code: 500, message: 'Unexpected error' });
    }
};
