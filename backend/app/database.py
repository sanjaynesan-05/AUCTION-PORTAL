from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import NullPool
from app.config import DATABASE_URL

# Create engine with connection pooling
# NullPool is used because Neon serverless requires special handling
engine = create_engine(
    DATABASE_URL,
    poolclass=NullPool,
    echo=False,  # Set to True for SQL debugging
    pool_pre_ping=True,  # Verify connections before using them
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


def get_db() -> Session:
    """Get database session for dependency injection"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Initialize database tables"""
    from app.models.orm import Base
    Base.metadata.create_all(bind=engine)


def drop_db():
    """Drop all database tables (for testing)"""
    from app.models.orm import Base
    Base.metadata.drop_all(bind=engine)
