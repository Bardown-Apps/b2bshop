const openCloudinaryWidget = ({
  folder,
  clientAllowedFormats = [],
  cb,
  multiple = false,
  sources = ["local"],
  maxFileSize = 5500000,
}) => {
  const myWidget = window.cloudinary.createUploadWidget(
    {
      cloudName: "dn0taoeju",
      show_powered_by: false,
      uploadPreset: "ey3noxzd",
      sources,
      folder,
      clientAllowedFormats,
      multiple,
      maxFileSize,
    },
    (error, result) => {
      if (!error && result && result.event === "success") {
        cb(result?.info);
        myWidget.close();
      }
    },
  );
  myWidget.open();
};

export default openCloudinaryWidget;
