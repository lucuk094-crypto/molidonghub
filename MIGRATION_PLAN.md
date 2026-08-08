# 🔄 MIGRATION TO DONGHUB API - EXECUTION PLAN

## 📋 STRATEGY

**API Base URL:** Tetap `https://www.sankavollerei.com/anime/donghua`  
**Response Format:** Update untuk match Donghub JSON structure

## 🎯 FILES TO UPDATE

### 1. Services (5 files)
- ✅ `src/services/animeInfoService.ts` - Map donghub detail structure
- ✅ `src/services/episodeService.ts` - Map donghub episode structure  
- ✅ `src/services/homeService.ts` - Map donghub home structure
- ✅ `src/services/animeByGenreService.ts` - Keep as is (should work)
- ✅ `src/services/genreService.ts` - Keep as is (should work)

### 2. Key Improvements
1. **animeInfoService**: 
   - Use `data.episodes` array (not missing anymore!)
   - `info` object for metadata
   - `recommendations` built-in
   
2. **episodeService**:
   - Use `navigation.all_slug` for anime ID (100% accurate!)
   - `streams` array for servers
   - `anime_info` for details

### 3. Pages (No changes needed)
- Pages use typed interfaces, so auto-compatible

## ⚠️ ASSUMPTION

**CRITICAL:** JSON samples kamu provide itu dari endpoint yang sama (sankavollerei.com), tapi dengan response format baru/berbeda.

Jika endpoint berbeda total (ex: donghub.vip punya API sendiri), kasih tau base URL-nya!

## 🚀 EXECUTION

Saya akan update services satu per satu, test di local dulu via build check.
