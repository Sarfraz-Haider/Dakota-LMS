const SHEET_NAME = "Form Responses 1";

function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) return respond({ error: "Sheet '" + SHEET_NAME + "' not found" });

    const data = sheet.getDataRange().getValues();
    const records = [];

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row[1]) continue;
      records.push({
        rowNum: i + 1,
        timestamp: fmtDate(row[0]),
        name: String(row[1] || ""),
        startDate: fmtDate(row[2]),
        endDate: fmtDate(row[3]),
        type: String(row[4] || ""),
        otherType: String(row[5] || ""),
        days: Number(row[6]) || 0,
        halfDay: String(row[7] || ""),
        lead: String(row[8] || ""),
        status: String(row[9] || ""),
        comments: String(row[10] || "")
      });
    }

    return respond({ success: true, records: records });
  } catch (err) {
    return respond({ error: err.toString() });
  }
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const action = body.action;
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) return respond({ error: "Sheet not found" });

    if (action === "add") {
      sheet.appendRow([
        new Date(),
        body.name || "",
        body.startDate || "",
        body.endDate || "",
        body.type || "",
        body.otherType || "",
        body.days || 0,
        body.halfDay || "",
        body.lead || "",
        "Pending",
        body.comments || ""
      ]);
      return respond({ success: true, action: "added" });
    }

    if (action === "update") {
      var r = body.rowNum;
      if (!r || r < 2) return respond({ error: "Invalid row" });
      if (body.startDate !== undefined)  sheet.getRange(r, 3).setValue(body.startDate);
      if (body.endDate !== undefined)    sheet.getRange(r, 4).setValue(body.endDate);
      if (body.type !== undefined)       sheet.getRange(r, 5).setValue(body.type);
      if (body.days !== undefined)       sheet.getRange(r, 7).setValue(body.days);
      if (body.halfDay !== undefined)    sheet.getRange(r, 8).setValue(body.halfDay);
      if (body.status !== undefined)     sheet.getRange(r, 10).setValue(body.status);
      if (body.comments !== undefined)   sheet.getRange(r, 11).setValue(body.comments);
      return respond({ success: true, action: "updated", row: r });
    }

    if (action === "delete") {
      var r = body.rowNum;
      if (!r || r < 2) return respond({ error: "Invalid row" });
      sheet.deleteRow(r);
      return respond({ success: true, action: "deleted" });
    }

    return respond({ error: "Unknown action" });
  } catch (err) {
    return respond({ error: err.toString() });
  }
}

function fmtDate(val) {
  if (!val) return "";
  if (val instanceof Date) {
    return String(val.getMonth() + 1).padStart(2, "0") + "/"
         + String(val.getDate()).padStart(2, "0") + "/"
         + val.getFullYear();
  }
  return String(val);
}

function respond(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
