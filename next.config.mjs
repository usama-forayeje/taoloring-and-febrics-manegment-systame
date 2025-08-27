


const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "api.slingacademy.com",
                port: "",
            },
            {
                protocol: "https",
                hostname: "images.unsplash.com",
                port: "",
            },
        ],
        unoptimized: true,
    },
    transpilePackages: ["geist"],
}

export default nextConfig
