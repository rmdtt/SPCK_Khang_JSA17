fetch(KITCHEN_API_URL)
  .then(response => response.json())
  .then(data => {
    console.log(data.products);
  })
  .catch(error => {
    console.error("Lỗi khi lấy dữ liệu đồ bếp:", error);
  });