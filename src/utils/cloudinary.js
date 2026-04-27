const openCloudinaryWidget = ({ cb }) => {
  const uploadedUrl = window.prompt("Paste uploaded file URL");
  if (!uploadedUrl) return;
  cb?.({ secure_url: uploadedUrl });
};

export default openCloudinaryWidget;
