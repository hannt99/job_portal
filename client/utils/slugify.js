import slugify from 'slugify';

const setSlug = (text) => {
    if (!text) return;
    return slugify(text, {
        replacement: '-',
        lower: true,
        strict: false,
        locale: 'vi',
        trim: true,
    });
};

export default setSlug;
