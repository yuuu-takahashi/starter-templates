// Axum: Sinatra のような軽量 Web フレームワーク
use axum::{routing::get, Router};
use std::net::SocketAddr;

async fn index() -> &'static str {
    "Hello, World!"
}

#[tokio::main]
async fn main() {
    let app = Router::new().route("/", get(index));

    let addr = SocketAddr::from(([0, 0, 0, 0], 8080));
    println!("Listening on http://localhost:8080");
    axum::serve(
        tokio::net::TcpListener::bind(addr).await.unwrap(),
        app,
    )
    .await
    .unwrap();
}
