import slugify from 'slugify';

const setSlug = (text) => {
    if (!text) return;
    return slugify(text, {
        trim: true,
        lower: true,
        replacement: '-',
        strict: false,
        locale: 'vi',
    });
};

export default setSlug;
