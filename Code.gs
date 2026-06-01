// ============================================================
//  Malabo WC2026 — Google Apps Script Backend
//  File: Code.gs
// ============================================================
//  Deploy as a Web App:
//    Execute as: Me
//    Who has access: Anyone
// ============================================================

// 🔧 Replace with YOUR Google Sheet ID (from the URL bar)
const SHEET_ID      = 'YOUR_GOOGLE_SHEET_ID_HERE';
const TAB_PLAYERS   = 'Players';
const TAB_RESULTS   = 'Results';
const ENTRY_FEE     = 20000;
const DEADLINE      = new Date('2026-06-10T23:59:59+01:00'); // WAT = UTC+1

// ============================================================
//  MAIN ENTRY POINT
// ============================================================

/**
 * Handles all GET requests.
 *
 * Routes:
 *   ?action=getData                            → returns players + results JSON
 *   ?action=addPlayer&name=…&title=…&dark=…&underdog=…  → adds a player
 */
function doGet(e) {
  const action = (e.parameter && e.parameter.action) || 'getData';

  try {
    if (action === 'addPlayer') {
      return handleAddPlayer(e.parameter);
    }
    return handleGetData();
  } catch (err) {
    return jsonResponse({ success: false, message: String(err) });
  }
}

// ============================================================
//  READ: return all players and current tournament results
// ============================================================

function handleGetData() {
  const ss = SpreadsheetApp.openById(SHEET_ID);

  // --- Results tab: Team → Stage code ---
  const results = {};
  const resultsSheet = ss.getSheetByName(TAB_RESULTS);
  if (resultsSheet && resultsSheet.getLastRow() > 1) {
    const rData = resultsSheet.getRange(2, 1, resultsSheet.getLastRow() - 1, 2).getValues();
    rData.forEach(function(row) {
      const team  = String(row[0]).trim();
      const stage = String(row[1]).trim();
      if (team && stage) results[team] = stage;
    });
  }

  // --- Players tab ---
  const players = [];
  const playersSheet = ss.getSheetByName(TAB_PLAYERS);
  if (playersSheet && playersSheet.getLastRow() > 1) {
    const pData = playersSheet.getRange(2, 1, playersSheet.getLastRow() - 1, 5).getValues();
    pData.forEach(function(row) {
      const name = String(row[1]).trim();
      if (!name) return; // skip blank rows
      players.push({
        timestamp : row[0] ? new Date(row[0]).toISOString() : '',
        name      : name,
        title     : String(row[2]).trim(),
        dark      : String(row[3]).trim(),
        underdog  : String(row[4]).trim()
      });
    });
  }

  return jsonResponse({ players: players, results: results });
}

// ============================================================
//  WRITE: add a new player entry
// ============================================================

function handleAddPlayer(params) {
  const name     = String(params.name     || '').trim();
  const title    = String(params.title    || '').trim();
  const dark     = String(params.dark     || '').trim();
  const underdog = String(params.underdog || '').trim();

  // Validation
  if (!name || !title || !dark || !underdog) {
    return jsonResponse({ success: false, message: 'All fields are required.' });
  }
  if (new Date() > DEADLINE) {
    return jsonResponse({ success: false, message: 'The entry deadline has passed.' });
  }

  const ss    = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName(TAB_PLAYERS);
  if (!sheet) {
    return jsonResponse({ success: false, message: 'Players sheet not found. Check SETUP.md.' });
  }

  // Duplicate name check (case-insensitive)
  if (sheet.getLastRow() > 1) {
    const existing = sheet.getRange(2, 2, sheet.getLastRow() - 1, 1).getValues();
    for (var i = 0; i < existing.length; i++) {
      if (String(existing[i][0]).trim().toLowerCase() === name.toLowerCase()) {
        return jsonResponse({
          success: false,
          message: 'A player named "' + name + '" has already entered. Each person may enter once.'
        });
      }
    }
  }

  // Append the new entry
  sheet.appendRow([new Date(), name, title, dark, underdog]);

  return jsonResponse({ success: true, message: 'Entry added successfully. Good luck, ' + name + '!' });
}

// ============================================================
//  HELPER
// ============================================================

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
