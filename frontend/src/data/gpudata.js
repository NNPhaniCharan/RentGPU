const gpuData = [
  {
    id: 1,
    model: "NVIDIA RTX 4090",
    provider: "Quantum Computing Services",
    shortDescription: "High-end GPU for demanding computational tasks",
    description:
      "The NVIDIA RTX 4090 delivers exceptional performance for AI training, rendering, and scientific computations.",
    price: 0.05, // ETH per hour
    specs: {
      cores: 16384,
      memory: "24 GB GDDR6X",
      memoryBandwidth: "1008 GB/s",
      performance: "82.6 TFLOPS",
      architecture: "Ada Lovelace",
      powerConsumption: "450W",
    },
    availability: "Immediate",
    minimumRental: 1, // hour
    rating: 4.9,
    reviews: 127,
  },
  {
    id: 2,
    model: "NVIDIA RTX 4080",
    provider: "DeepCompute Network",
    shortDescription: "Balanced performance for ML training and inference",
    description:
      "The NVIDIA RTX 4080 offers high-performance computing capabilities for machine learning and data processing.",
    price: 0.035, // ETH per hour
    specs: {
      cores: 9728,
      memory: "16 GB GDDR6X",
      memoryBandwidth: "716.8 GB/s",
      performance: "48.7 TFLOPS",
      architecture: "Ada Lovelace",
      powerConsumption: "320W",
    },
    availability: "Immediate",
    minimumRental: 1, // hour
    rating: 4.7,
    reviews: 93,
  },
  {
    id: 3,
    model: "AMD Radeon RX 7900 XTX",
    provider: "GlobalGPU Solutions",
    shortDescription: "High-performance computing with RDNA 3 architecture",
    description:
      "The AMD Radeon RX 7900 XTX delivers exceptional computing performance for various workloads.",
    price: 0.03, // ETH per hour
    specs: {
      cores: 12288,
      memory: "24 GB GDDR6",
      memoryBandwidth: "960 GB/s",
      performance: "61 TFLOPS",
      architecture: "RDNA 3",
      powerConsumption: "355W",
    },
    availability: "2 hours",
    minimumRental: 2, // hours
    rating: 4.6,
    reviews: 78,
  },
  {
    id: 4,
    model: "NVIDIA A100",
    provider: "Enterprise AI Solutions",
    shortDescription: "Data center GPU for AI and HPC workloads",
    description:
      "The NVIDIA A100 is designed for data centers and high-performance computing applications.",
    price: 0.08, // ETH per hour
    specs: {
      cores: 6912,
      memory: "80 GB HBM2e",
      memoryBandwidth: "2039 GB/s",
      performance: "19.5 TFLOPS",
      architecture: "Ampere",
      powerConsumption: "400W",
    },
    availability: "Immediate",
    minimumRental: 1, // hour
    rating: 4.9,
    reviews: 156,
  },
  {
    id: 5,
    model: "NVIDIA RTX 3090",
    provider: "CloudGPU Network",
    shortDescription: "Affordable option for various compute workloads",
    description:
      "The NVIDIA RTX 3090 offers a good balance of performance and cost for various computational tasks.",
    price: 0.02, // ETH per hour
    specs: {
      cores: 10496,
      memory: "24 GB GDDR6X",
      memoryBandwidth: "936 GB/s",
      performance: "35.6 TFLOPS",
      architecture: "Ampere",
      powerConsumption: "350W",
    },
    availability: "Immediate",
    minimumRental: 1, // hour
    rating: 4.5,
    reviews: 218,
  },
  {
    id: 6,
    model: "AMD Instinct MI250X",
    provider: "High Performance Computing Inc.",
    shortDescription: "High-end data center GPU for scientific computing",
    description:
      "The AMD Instinct MI250X is designed for high-performance computing and scientific workloads.",
    price: 0.07, // ETH per hour
    specs: {
      cores: 14080,
      memory: "128 GB HBM2e",
      memoryBandwidth: "3276 GB/s",
      performance: "95.7 TFLOPS",
      architecture: "CDNA 2",
      powerConsumption: "560W",
    },
    availability: "4 hours",
    minimumRental: 4, // hours
    rating: 4.8,
    reviews: 42,
  },
];

export default gpuData;
