export const LOCAL_VIDEOS: Record<string, any> = {
    burpees: require("../assets/videos/burpees.mp4"),
    flexiones: require("../assets/videos/flexiones.mp4"),
    mountain: require("../assets/videos/mountain.mp4"),
    plancha: require("../assets/videos/plancha.mp4"),
    sentadillas: require("../assets/videos/sentadillas.mp4"),
    zancadas: require("../assets/videos/zancadas.mp4"),
};

export const getLocalVideoSource = (videoKey?: string) => {
    if (!videoKey) return null;
    return LOCAL_VIDEOS[videoKey] || null;
};