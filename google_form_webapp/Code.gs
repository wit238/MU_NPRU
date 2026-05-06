function doGet() {
  // ฟังก์ชันนี้ทำงานเมื่อมีคนกดเข้ามาหน้าเว็บ
  return HtmlService.createHtmlOutputFromFile('index')
      .setTitle('แบบประเมินความพึงพอใจ นครปฐม')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function saveData(formData) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // ตั้งค่าหัวตารางครั้งแรกถ้ายังไม่มีข้อมูล
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "วัน-เวลา", "เพศ", "อายุ", "อาชีพ", "เคยมาเที่ยวไหม",
        "Q1-UI", "Q2-ความรวดเร็ว", "Q3-ความถูกต้อง", "Q4-ข้อมูลครบถ้วน", 
        "Q5-แนะนำตรงใจ", "Q6-ความสวยงาม", "Q7-ช่วยวางแผน", 
        "Q8-เกร็ดความรู้", "Q9-ค้นหาสะดวก", "Q10-พึงพอใจรวม", "ข้อเสนอแนะ"
      ]);
      sheet.getRange("A1:P1").setFontWeight("bold").setBackground("#e2e8f0");
    }

    // เซฟข้อมูลลงเซลล์ในแต่ละแถว
    sheet.appendRow([
      new Date(), 
      formData.q_gender, 
      formData.q_age, 
      formData.q_occupation_other ? formData.q_occupation_other : formData.q_occupation, 
      formData.q_visited, 
      formData.q1, formData.q2, formData.q3, formData.q4, formData.q5, 
      formData.q6, formData.q7, formData.q8, formData.q9, formData.q10, 
      formData.q_comments
    ]);
    return "SUCCESS";
  } catch(e) {
    return "ERROR: " + e.toString();
  }
}
