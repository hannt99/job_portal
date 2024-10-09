/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false, // disable React strict mode.
    productionBrowserSourceMaps: false, // Disable source maps in development
    async redirects() {
        return [
            {
                source: '/register',
                destination: '/register/candidate',
                permanent: true,
            },
            {
                source: '/employer',
                destination: '/employer/dashboard',
                permanent: true,
            },
            {
                source: '/admin',
                destination: '/admin/dashboard',
                permanent: true,
            },

        ];
    },
};

export default nextConfig;
