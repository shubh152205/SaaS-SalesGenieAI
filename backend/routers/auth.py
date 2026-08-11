from fastapi import APIRouter, HTTPException, Depends, Header
from typing import Optional
from database import get_db
from auth import hash_password, verify_password, create_access_token, decode_token
from models.schemas import RegisterRequest, LoginRequest, TokenResponse, UserResponse

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


def get_current_user(authorization: Optional[str] = Header(None)) -> dict:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authentication token")
    token = authorization.split(" ")[1]
    try:
        payload = decode_token(token)
        return payload
    except Exception:
        raise HTTPException(status_code=401, detail="Token expired or invalid signature")


@router.post("/register", response_model=TokenResponse)
def register(req: RegisterRequest):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT id FROM users WHERE email = ?", (req.email.lower(),))
    if cur.fetchone():
        conn.close()
        raise HTTPException(status_code=400, detail="An account with this email already exists")

    pwd_hash, salt = hash_password(req.password)
    cur.execute(
        "INSERT INTO users (name, email, password_hash, salt) VALUES (?, ?, ?, ?)",
        (req.name.strip(), req.email.lower(), pwd_hash, salt)
    )
    user_id = cur.lastrowid

    # Log registration activity
    cur.execute(
        "INSERT INTO activity_log (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)",
        (user_id, "User Registered", "user", user_id, f"Account created for {req.email}")
    )
    conn.commit()
    conn.close()

    token = create_access_token(user_id, req.email.lower(), req.name.strip())
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user_id=user_id,
        name=req.name.strip(),
        email=req.email.lower()
    )


@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT id, name, email, password_hash, salt FROM users WHERE email = ?", (req.email.lower(),))
    user = cur.fetchone()
    conn.close()

    if not user or not verify_password(req.password, user["password_hash"], user["salt"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token(user["id"], user["email"], user["name"])
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user_id=user["id"],
        name=user["name"],
        email=user["email"]
    )


@router.get("/me", response_model=UserResponse)
def get_profile(current_user: dict = Depends(get_current_user)):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT id, name, email, created_at FROM users WHERE id = ?", (int(current_user["sub"]),))
    user = cur.fetchone()
    conn.close()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return UserResponse(
        id=user["id"],
        name=user["name"],
        email=user["email"],
        created_at=str(user["created_at"])
    )
