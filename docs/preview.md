API cho Xử lí học bạ scan
Request:
curl -X 'POST' \
  'https://api.connectedbrain.com.vn/api/v1/leloi/upload-pdf/' \
  -H 'accept: application/json' \
  -H 'Content-Type: multipart/form-data' \
  -F 'file=@Lê Ngọc Hải.pdf;type=application/pdf'
​
Response example: unk : no information
{
  "Lớp 1": {
    "Tên": "Bùi Chí Hiếu",
    "Điểm": [
      {
        "Môn": "Tiếng Việt",
        "Mức": "T",
        "Điểm": 10
      },
      {
        "Môn": "Toán",
        "Mức": "T",
        "Điểm": 9
      },
      {
        "Môn": "Tự nhiên và xã hội",
        "Mức": "T",
        "Điểm": "unk"
      },
      {
        "Môn": "Đạo đức",
        "Mức": "T",
        "Điểm": "unk"
      },
      {
        "Môn": "Âm nhạc",
        "Mức": "H",
        "Điểm": "unk"
      },
      {
        "Môn": "Mỹ thuật",
        "Mức": "T",
        "Điểm": "unk"
      },
      {
        "Môn": "Thủ công",
        "Mức": "H",
        "Điểm": "unk"
      },
      {
        "Môn": "Thể dục",
        "Mức": "H",
        "Điểm": "unk"
      }
    ],
    "Phẩm chất": {
      "Chăm học, chăm làm": "Tốt",
      "Tự tin, trách nhiệm": "Tốt",
      "Trung thực, kỉ luật": "Tốt",
      "Đoàn kết, yêu thương": "Tốt"
    },
    "Năng lực": {
      "Tự phục vụ, tự quản": "Tốt",
      "Hợp tác": "Tốt",
      "Tự học và giải quyết vấn đề": "Tốt"
    }
  },
	....
}
​
API xử lí chứng chỉ:
curl -X 'POST' \
  'https://api.connectedbrain.com.vn/api/v1/leloi/certificate?name=NAME' \
  -H 'accept: application/json' \
  -H 'Content-Type: multipart/form-data' \
  -F 'file=@unnamed (1).jpg;type=image/jpeg'
​
Response example:
{
  "name": "Name of post request", 
  "extracted_name": "extracted name from image",
  "level": "Tỉnh",
  "correct": false
}

dựa vào endpoint này, tạo 2 page với mantine nằm trong admin để thực hiện 2 tính năng này:
- yêu cầu là chỉ cần một box, tiêu đề, desciprtion, là upload 
