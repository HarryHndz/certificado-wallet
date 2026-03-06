import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permite cualquier IP de red local (192.168.x.x, 10.x.x.x, 172.16-31.x.x) y localhost
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "192.168.68.76",
    "192.168.*",
    "10.*",
    "172.16.*",
    "172.17.*",
    "172.18.*",
    "172.19.*",
    "172.20.*",
    "172.21.*",
    "172.22.*",
    "172.23.*",
    "172.24.*",
    "172.25.*",
    "172.26.*",
    "172.27.*",
    "172.28.*",
    "172.29.*",
    "172.30.*",
    "172.31.*",
  ],
};

export default nextConfig;
