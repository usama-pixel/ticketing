/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
        if(!isServer) {
            config.watchOptions = {
                poll: 300,
                aggregateTimeout: 300,
            }
        }
        return config
    }
};

export default nextConfig;
