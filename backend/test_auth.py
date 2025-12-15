from app.api.auth import verify_password, get_password_hash
from app.database import SessionLocal
from app.models.orm import User

# Test password hashing
test_hash = get_password_hash('auction123')
print(f'Hash created: {test_hash[:30]}...')
print(f'Verification test: {verify_password("auction123", test_hash)}')

# Check admin user in database
db = SessionLocal()
try:
    admin_user = db.query(User).filter(User.username == "admin").first()
    if admin_user:
        print(f'\nAdmin user found:')
        print(f'  Username: {admin_user.username}')
        print(f'  Role: {admin_user.role}')
        print(f'  Password hash: {admin_user.password_hash[:30]}...')
        print(f'  Password verification: {verify_password("auction123", admin_user.password_hash)}')
    else:
        print('\nAdmin user NOT found!')
finally:
    db.close()
