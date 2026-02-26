"""
Seed script for sample Physics data.
Run: python3 seed_data.py
"""
import os
import sys

# Add parent to path so we can import rag modules
sys.path.insert(0, os.path.dirname(__file__))

from rag.processor import DocumentProcessor
from rag.vector_store import VectorStoreManager

PHYSICS_TEXT = """Physics: Classical Mechanics

Force equals mass times acceleration (F=ma). This is Newton's Second Law of Motion.
The unit of force is the Newton (N). One Newton is the force needed to accelerate
one kilogram of mass at the rate of one metre per second squared.

Newton's First Law states that an object at rest stays at rest, and an object in
motion stays in motion unless acted upon by an external force. This is also known
as the Law of Inertia.

Newton's Third Law states that for every action, there is an equal and opposite
reaction. When you push on a wall, the wall pushes back on you with equal force.

Work is done when a force acts upon an object to cause a displacement.
Work = Force x Distance x cos(theta). The SI unit of work is the Joule (J).

Power is the rate at which work is done. Power = Work / Time.
The SI unit of power is the Watt (W).

Energy is the capacity to do work. There are two main types:
- Kinetic Energy (KE) = 1/2 * m * v^2 (energy of motion)
- Potential Energy (PE) = m * g * h (energy of position)

The Law of Conservation of Energy states that energy cannot be created or destroyed,
only transformed from one form to another. The total energy in a closed system
remains constant.

Momentum is the product of mass and velocity: p = m * v.
The Law of Conservation of Momentum states that in a closed system, the total
momentum before a collision equals the total momentum after the collision.
"""

def seed():
    # Write sample file
    sample_path = os.path.join(os.path.dirname(__file__), "uploads", "physics_notes.txt")
    os.makedirs(os.path.dirname(sample_path), exist_ok=True)
    with open(sample_path, "w") as f:
        f.write(PHYSICS_TEXT)

    # Process and index
    processor = DocumentProcessor()
    vector_store = VectorStoreManager()

    pages = processor.extract_text_from_txt(sample_path)
    chunks = processor.chunk_text(pages, chunk_size=300, overlap=50)
    vector_store.add_documents("physics_001", chunks, "physics_notes.txt")

    print(f"✅ Seeded {len(chunks)} chunks for Physics subject")
    print(f"📁 Sample file: {sample_path}")

    # Quick test
    results = vector_store.search("physics_001", "What is F=ma?")
    print(f"🔍 Test search for 'What is F=ma?' returned {len(results)} results")
    if results:
        print(f"   Top result: {results[0]['content'][:80]}...")

if __name__ == "__main__":
    seed()
