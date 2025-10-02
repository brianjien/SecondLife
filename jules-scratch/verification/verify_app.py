from playwright.sync_api import Page, expect

def test_app_functionality(page: Page):
    """
    This test verifies the core functionality of the SecondLife application,
    including login, checkout, and the "Ask a Question" feature.
    """
    # 1. Arrange: Go to the application homepage.
    page.goto("http://localhost:5173")

    # 2. Act: Log in as the demo user.
    page.get_by_role("button", name="Login").click()
    page.get_by_placeholder("Email Address").fill("demo@example.com")
    page.get_by_placeholder("Password").fill("demo123")
    page.get_by_role("button", name="Login").click()

    # Wait for the main page to load after login
    expect(page.get_by_text("Sell & Earn 5% Extra!")).to_be_visible()

    # 3. Act: Add an item to the cart and go to checkout.
    page.get_by_text("Leather Jacket").first.click()
    page.get_by_role("button", name="Add to Cart").click()
    page.get_by_role("button", name="Shopping Cart").click()
    page.get_by_role("button", name="Proceed to Checkout").click()

    # 4. Assert: Verify the "Face to Face" option is visible.
    expect(page.get_by_text("Face to Face")).to_be_visible()

    # 5. Act: Go back to a product and ask a question.
    page.get_by_role("button", name="Cancel").click()
    page.get_by_text("Leather Jacket").first.click()
    page.get_by_placeholder("Type your question...").fill("Is this real leather?")
    page.get_by_role("button", name="Ask").click()

    # 6. Assert: Verify the new question appears immediately.
    expect(page.get_by_text("Is this real leather?")).to_be_visible()

    # 7. Screenshot: Capture the final result for visual verification.
    page.screenshot(path="jules-scratch/verification/verification.png")