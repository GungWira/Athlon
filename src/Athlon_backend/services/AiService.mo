import IC "ic:aaaaa-aa";
import Cycles "mo:base/ExperimentalCycles";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Debug "mo:base/Debug";
import GlobalConstants "../constants/GlobalConstants";
import AiTypes "../types/AiTypes";
import JSON "mo:json";

module AiService {

  public func askBot(input : Text, pastAnswer : Text) : async Result.Result<Text, Text> {
    let idempotency_key : Text = generateUUID();
    // GEMINI
    let url = "https://" # GlobalConstants.HOST # GlobalConstants.PATH # GlobalConstants.API_KEY;

    let request_headers = [
      { name = "User-Agent"; value = "POST_USER_COMMAND" },
      { name = "Content-Type"; value = "application/json" },
      { name = "Idempotency-Key"; value = idempotency_key },
    ];

    let request_body_json : Text = "{\"contents\":[{\"parts\": [{\"text\": \"Berikut adalah sebuah pesan dalam percakapan antara pengguna dan AI yang membahas topik olahraga, baik olahraga harian, manfaat olahraga, kebugaran fisik, maupun gaya hidup aktif. Fokus percakapan adalah pada prompt berikut: \\\" #input# \\\"\\n\\nUser juga sebelumnya mendapatkan jawaban ini dari anda : \\\" #pastAnswer# \\\"\\n\\nAnda bernama FitBot, seorang asisten pribadi yang akan membantu user menjadi lebih sehat, bugar, dan semangat menjalani gaya hidup aktif. Berikan respons dalam format JSON string yang valid dengan struktur:\\n\\n{\\\\\\\"response\\\\\\\": {\\\\\\\"solution\\\\\\\": \\\\\\\"[jawaban]\\\\\\\", \\\\\\\"expAmmount\\\\\\\": {\\\\\\\"point\\\\\\\": [0/15/25/50]}}}\"}]}]}";

    let request_body = Text.encodeUtf8(request_body_json);

    Debug.print("REQUEST-BODY : " #debug_show (request_body));

    let http_request : IC.http_request_args = {
      url = url;
      max_response_bytes = null;
      headers = request_headers;
      body = ?request_body;
      method = #post;
      transform = null;
    };

    Cycles.add<system>(230_850_258_000);
    let http_response : IC.http_request_result = await IC.http_request(http_request);

    let decoded_text : Text = switch (Text.decodeUtf8(http_response.body)) {
      case (null) { return #err("No value returned") };
      case (?y) { y };
    };

    Debug.print("DECODED-TEXT : " #debug_show (decoded_text));

    switch (JSON.parse(decoded_text)) {
      case (#err(e)) {
        Debug.print("Parse error: " # debug_show (e));
        return #err("Error parsing response");
      };
      case (#ok(data)) {
        switch (JSON.get(data, "candidates[0].content.parts[0].text")) {
          case (null) {
            return #err("Field not found in response");
          };
          case (?jsonString) {
            switch (jsonString) {
              case (#string(text)) {
                return #ok(text);
              };
              case _ {
                return #err("Unexpected response format");
              };
            };
          };
        };
      };
    };
  };

  public func generateDesc(content : AiTypes.GenDescAi) : async Result.Result<Text, Text> {
    let idempotency_key : Text = generateUUID();
    // GEMINI
    let url = "https://" # GlobalConstants.HOST # GlobalConstants.PATH # GlobalConstants.API_KEY;
    let {
      arenaName;
      locations;
      sportsType;
      context;
    } = content;
    let request_headers = [
      { name = "User-Agent"; value = "POST_USER_COMMAND" },
      { name = "Content-Type"; value = "application/json" },
      { name = "Idempotency-Key"; value = idempotency_key },
    ];

    let request_body_json : Text = "{\"contents\":[{\"parts\":[{\"text\": \"" #
    "role: Athlonia\\n" #
    "description: Athlonia adalah AI penulis konten profesional dan asisten kreatif yang ahli dalam dunia olahraga. dengan bahasa yang tidak kaku dan pendeskripsian yang fun\\n" #
    "task: Mendeskripsikan Arena Dengan Format Penjualan Yang Jelas\\n" #
    "output_format:  Deskriptif \\n" #
    "style_guide:\\n" #
    "- tone: formal, lugas, profesional tapi tidak kaku\\n" #
    "- structure:\\n" #
    "  1. Nama, jenis, lokasi, kapasitas, tahun buka\\n" #
    "  2. Rincian fasilitas unggulan dan keunggulan\\n" #
    "  3. Nilai jual tempat secara persuasif\\n" #
    "input:\\n" #
    "- arenaName: " # arenaName # "\\n" #
    "- context: " # context # "\\n" #
    "- formatOutput: Deskriptif \\n" #
    "- locations: " # locations # "\\n" #
    "- sportsType: " # sportsType # "\\n" #
    "\"}]}]}";

    let request_body = Text.encodeUtf8(request_body_json);

    let http_request : IC.http_request_args = {
      url = url;
      max_response_bytes = null;
      headers = request_headers;
      body = ?request_body;
      method = #post;
      transform = null;
    };

    Cycles.add<system>(230_850_258_000);
    let http_response : IC.http_request_result = await IC.http_request(http_request);

    // Debug.print("REQUEST-BODY : " #debug_show (Text.decodeUtf8(http_response.body)));

    let decoded_text : Text = switch (Text.decodeUtf8(http_response.body)) {
      case (null) { return #err("No value returned") };
      case (?y) { y };
    };

    switch (JSON.parse(decoded_text)) {
      case (#err(e)) {
        Debug.print("Parse Text Error: " # debug_show (e));
        return #err("Error parsing response");
      };
      case (#ok(data)) {
        // Debug.print("PARSED-JSON : " #debug_show (data));

        switch (JSON.get(data, "candidates[0].content.parts[0].text")) {
          case (null) {
            Debug.print("Field tidak ditemukan");
            return #err("Field not found in response");
          };
          case (?jsonString) {
            switch (jsonString) {
              case (#string(text)) {
                // Debug.print("RESPONSE-TEXT: " # debug_show (text));
                return #ok(text);
              };
              case _ {
                Debug.print("Unexpected JSON value type");
                return #err("Unexpected response format");
              };
            };
          };
        };
      };
    };
  };

  public func generateUUID() : Text {
    "UUID-123456789";
  };
};
