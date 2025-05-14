import IC "ic:aaaaa-aa";
import Cycles "mo:base/ExperimentalCycles";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Debug "mo:base/Debug";
import GlobalConstants "../constants/GlobalConstants";
import AiTypes "../types/AiTypes";
import Json "mo:json";  

module AiService {

  public func askBot(input : Text, pastAnswer : Text) : async () {
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
      case (null) { "No value returned" };
      case (?y) { y };
    };

    Debug.print("DECODED-TEXT : " #debug_show (decoded_text));
    Debug.print("Checking for 'null': " # debug_show (Text.contains(decoded_text, #text "null")));
  };

  public func generateDesc(input : Text, content : AiTypes.GenDescAi) : async Text {
    let idempotency_key : Text = generateUUID();
    // GEMINI
    let url = "https://" # GlobalConstants.HOST # GlobalConstants.PATH # GlobalConstants.API_KEY;
    let {
      instructions;
      arenaName;
      locations;
      formatOutput;
      sportsType;
      context;
      facilitate;
    } = content;
    let request_headers = [
      { name = "User-Agent"; value = "POST_USER_COMMAND" },
      { name = "Content-Type"; value = "application/json" },
      { name = "Idempotency-Key"; value = idempotency_key },
    ];

    let body : AiTypes.Body = {
      role = "Athlonia";
      description = "Athlonia adalah AI penulis konten profesional dan asisten kreatif yang ahli dalam dunia olahraga. " #
      "Athlonia akan menghasilkan konten yang sesuai dengan jenis output yang diminta, yaitu deskripsi atau aturan penggunaan arena olahraga.";
      task = instructions;
      output_format = formatOutput;
      style_guide = {
        tone = "formal, lugas, profesional tapi tidak kaku";
        structure = [
          "Paragraf 1: Nama, jenis, lokasi, kapasitas (jika ada), tahun buka (jika ada)",
          "Paragraf 2: Rincian fasilitas unggulan dan keunggulan arsitektur/teknologi",
          "Paragraf 3: Nilai jual tempat, dijelaskan secara persuasif dan menggunakan perbandingan",
        ];
      };
      input = content;
      note = "Harap hasilkan konten yang relevan, sesuai gaya dan format yang diminta, serta mudah dikustomisasi " #
      "jika saya ingin menambahkan informasi tambahan. Jangan sisipkan penjelasan tambahan, langsung " #
      "tampilkan hasil akhir sesuai jenis output yang dipilih.";
    };

    let request_body_json : Text = Json.stringify(body);

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
      case (null) { "No value returned" };
      case (?y) { y };
    };

    return decoded_text;
  };

  public func generateUUID() : Text {
    "UUID-123456789";
  };
};
