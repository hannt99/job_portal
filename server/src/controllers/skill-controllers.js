import Skill from '../models/Skill.js';

/**
 * Controller to create skill
 * */
export const createSkillController = async (req, res) => {
    try {
        const skill = await Skill.findOne({ skill: req.body.skill });
        if (skill) return res.status(400).json({ code: 400, message: 'Kỹ năng đã tồn tại' });

        const newSkill = new Skill(req.body);
        await newSkill.save();

        res.status(200).json({ code: 200, message: 'Tạo kỹ năng thành công' });
    } catch (err) {
        console.error(`Error in createSkillController: ${err}`);
        res.status(500).json({ code: 500, message: 'Unexpected error' });
    }
};

/**
 * Controller to get skill details by skillId
 * */
export const getSkillByIdController = async (req, res) => {
    try {
        const { skillId } = req.params;

        const skill = await Skill.findById(skillId);

        res.status(200).json({ code: 200, message: 'Success', skill });
    } catch (err) {
        console.error(`Error in getSkillByIdController: ${err}`);
        res.status(500).json({ code: 500, message: 'Unexpected error' });
    }
};

/**
 * Controller to get all skills
 * */
export const getAllSkillController = async (req, res) => {
    try {
        let { limit, page } = req.query;
        if (!limit) limit = 5;
        if (!page) page = 1;

        const skip = (page - 1) * limit;

        const skills = await Skill.find().sort({ createdAt: -1 }).skip(skip).limit(limit);

        const totalSkills = await Skill.countDocuments();

        const totalPages = Math.ceil(totalSkills / limit);

        res.status(200).json({ code: 200, message: 'Success', skills, totalPages });
    } catch (err) {
        console.error(`Error in getAllSkillController: ${err}`);
        res.status(500).json({ code: 500, message: 'Unexpected error' });
    }
};

/**
 * Controller to update skill details
 * */
export const updateSkillByIdController = async (req, res) => {
    try {
        const { skillId } = req.params;

        const updated = await Skill.findByIdAndUpdate(
            skillId,
            { $set: req.body },
            {
                new: true,
            },
        );

        res.status(200).json({ code: 200, message: 'Cập nhật kỹ năng thành công', updated });
    } catch (err) {
        console.error(`Error in updateSkillByIdController: ${err}`);
        res.status(500).json({ code: 500, message: 'Unexpected error' });
    }
};

/**
 * Controller to delete skill by skillId
 * */
export const deleteSkillByIdController = async (req, res) => {
    try {
        const { skillId } = req.params;

        await Skill.findByIdAndDelete(skillId);

        res.status(200).json({ code: 200, message: 'Xóa kỹ năng thành công' });
    } catch (err) {
        console.error(`Error in deleteSkillByIdController: ${err}`);
        res.status(500).json({ code: 500, message: 'Unexpected error' });
    }
};
