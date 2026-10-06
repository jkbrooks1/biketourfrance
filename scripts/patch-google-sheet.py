import os
import sys
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build

SHEET_ID = "1vzlhoekeVcx437ajMMFU--1kIrE7DfKYvi8rKhlE9aw"
RANGE_NAME = "'Approved Site Copy'!A:B"
TARGET_FIELD = "/resources-library/text_18"
NEW_TEXT = "Historical background for the Canal des Deux Mers route. Formatted for a phone."

# Standard path for your BTF service account credential
CREDS_PATH = os.path.expanduser("~/.config/jb/btf-general-service-account.json")

if not os.path.exists(CREDS_PATH):
    print(f"❌ Error: Credentials not found at {CREDS_PATH}")
    sys.exit(1)

try:
    creds = Credentials.from_service_account_file(
        CREDS_PATH, scopes=['https://www.googleapis.com/auth/spreadsheets']
    )
    service = build('sheets', 'v4', credentials=creds)
    sheet = service.spreadsheets()

    # 1. Get current data to find the right row
    result = sheet.values().get(spreadsheetId=SHEET_ID, range=RANGE_NAME).execute()
    values = result.get('values', [])
    
    target_row = None
    for i, row in enumerate(values):
        if row and row[0] == TARGET_FIELD:
            target_row = i + 1  # Sheets are 1-indexed
            break
            
    if not target_row:
        print(f"❌ Error: Field {TARGET_FIELD} not found in sheet.")
        sys.exit(1)
        
    # 2. Update the specific cell (Column B of the target row)
    update_range = f"'Approved Site Copy'!B{target_row}"
    body = {
        'values': [[NEW_TEXT]]
    }
    
    sheet.values().update(
        spreadsheetId=SHEET_ID, range=update_range,
        valueInputOption='USER_ENTERED', body=body
    ).execute()
    
    print(f"✅ Successfully updated {TARGET_FIELD} in Google Sheet.")
    
except Exception as e:
    print(f"❌ Failed to update sheet: {e}")
    sys.exit(1)
