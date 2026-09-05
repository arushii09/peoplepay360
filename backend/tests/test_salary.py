"""
Tests for Salary Structure and Salary Rule endpoints.

Tests are ordered intentionally: later tests depend on data created by earlier ones
(e.g., rule tests need a structure to exist). This mirrors the real-world workflow:
  Create Structure → Add Rules → Verify Ordering → Verify Validation
"""
import pytest


# =====================================================
# Salary Structure Tests
# =====================================================

class TestSalaryStructure:

    def test_create_salary_structure(self, client, admin_headers):
        """A valid salary structure should be created and returned with 201."""
        response = client.post(
            "/api/v1/salary-structures",
            json={"name": "Standard Engineering", "code": "ENG_2026", "description": "Engineering salary structure"},
            headers=admin_headers,
        )
        assert response.status_code == 201
        data = response.json()
        assert data["code"] == "ENG_2026"
        assert data["name"] == "Standard Engineering"
        assert data["is_active"] is True
        assert "id" in data
        assert "created_at" in data

    def test_code_is_normalized_to_uppercase(self, client, admin_headers):
        """Codes with lowercase or spaces should be normalized automatically."""
        response = client.post(
            "/api/v1/salary-structures",
            json={"name": "Sales Structure", "code": "sales staff 2026"},
            headers=admin_headers,
        )
        assert response.status_code == 201
        assert response.json()["code"] == "SALES_STAFF_2026"

    def test_create_duplicate_structure_code_rejected(self, client, admin_headers):
        """Creating a second structure with the same code should return 400."""
        client.post(
            "/api/v1/salary-structures",
            json={"name": "Duplicate A", "code": "DUPLICATE_CODE"},
            headers=admin_headers,
        )
        response = client.post(
            "/api/v1/salary-structures",
            json={"name": "Duplicate B", "code": "DUPLICATE_CODE"},
            headers=admin_headers,
        )
        assert response.status_code == 400
        assert "DUPLICATE_CODE" in response.json()["detail"]

    def test_list_salary_structures(self, client, admin_headers):
        """GET /salary-structures should return a list of all structures."""
        response = client.get("/api/v1/salary-structures", headers=admin_headers)
        assert response.status_code == 200
        assert isinstance(response.json(), list)
        assert len(response.json()) >= 1

    def test_get_structure_with_rules(self, client, admin_headers):
        """GET /salary-structures/{id} should return structure with its rules."""
        # Create a fresh structure for this test
        create_resp = client.post(
            "/api/v1/salary-structures",
            json={"name": "Structure With Rules", "code": "SWR_TEST"},
            headers=admin_headers,
        )
        structure_id = create_resp.json()["id"]

        response = client.get(f"/api/v1/salary-structures/{structure_id}", headers=admin_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == structure_id
        assert "rules" in data

    def test_get_nonexistent_structure_returns_404(self, client, admin_headers):
        """Requesting a structure that doesn't exist should return 404."""
        response = client.get("/api/v1/salary-structures/99999", headers=admin_headers)
        assert response.status_code == 404

    def test_unauthenticated_request_rejected(self, client):
        """Any request without a valid token should return 401."""
        response = client.get("/api/v1/salary-structures")
        assert response.status_code == 401


# =====================================================
# Salary Rule Tests
# =====================================================

class TestSalaryRule:

    @pytest.fixture(autouse=True, scope="class")
    @classmethod
    def structure_id(cls, client, admin_headers):
        """Creates a fresh salary structure for all rule tests in this class."""
        response = client.post(
            "/api/v1/salary-structures",
            json={"name": "Rule Test Structure", "code": "RULE_TEST"},
            headers=admin_headers,
        )
        cls._structure_id = response.json()["id"]

    def _structure(self):
        return self.__class__._structure_id

    def test_create_fixed_rule(self, client, admin_headers):
        """A FIXED rule requires fixed_amount. It represents a flat salary component."""
        response = client.post(
            "/api/v1/salary-rules",
            json={
                "structure_id": self._structure(),
                "name": "Basic Salary",
                "code": "BASIC",
                "category": "BASIC",
                "sequence": 10,
                "computation_type": "FIXED",
                "fixed_amount": "3000.00",
            },
            headers=admin_headers,
        )
        assert response.status_code == 201
        data = response.json()
        assert data["code"] == "BASIC"
        assert data["computation_type"] == "FIXED"
        assert data["fixed_amount"] == 3000.0

    def test_create_percentage_rule(self, client, admin_headers):
        """A PERCENTAGE rule requires percentage_value (0–100)."""
        response = client.post(
            "/api/v1/salary-rules",
            json={
                "structure_id": self._structure(),
                "name": "House Rent Allowance",
                "code": "HRA",
                "category": "ALLOWANCE",
                "sequence": 20,
                "computation_type": "PERCENTAGE",
                "percentage_value": "20.00",
            },
            headers=admin_headers,
        )
        assert response.status_code == 201
        assert response.json()["computation_type"] == "PERCENTAGE"
        assert response.json()["percentage_value"] == 20.0

    def test_create_overtime_rule(self, client, admin_headers):
        """
        An OVERTIME rule requires fixed_amount as the multiplier.
        e.g., 1.5 means time-and-a-half. The engine handles the calculation.
        """
        response = client.post(
            "/api/v1/salary-rules",
            json={
                "structure_id": self._structure(),
                "name": "Overtime Pay",
                "code": "OT_PAY",
                "category": "ALLOWANCE",
                "sequence": 25,
                "computation_type": "OVERTIME",
                "fixed_amount": "1.5",
            },
            headers=admin_headers,
        )
        assert response.status_code == 201
        data = response.json()
        assert data["computation_type"] == "OVERTIME"
        assert data["fixed_amount"] == 1.5

    def test_create_leave_deduction_rule(self, client, admin_headers):
        """A LEAVE_DEDUCTION rule needs no extra fields; the engine computes daily rate."""
        response = client.post(
            "/api/v1/salary-rules",
            json={
                "structure_id": self._structure(),
                "name": "Unpaid Leave Deduction",
                "code": "LEAVE_DED",
                "category": "DEDUCTION",
                "sequence": 30,
                "computation_type": "LEAVE_DEDUCTION",
            },
            headers=admin_headers,
        )
        assert response.status_code == 201
        assert response.json()["computation_type"] == "LEAVE_DEDUCTION"

    def test_create_deduction_rule(self, client, admin_headers):
        """A deduction is just a FIXED or PERCENTAGE rule with category=DEDUCTION."""
        response = client.post(
            "/api/v1/salary-rules",
            json={
                "structure_id": self._structure(),
                "name": "Provident Fund",
                "code": "PF",
                "category": "DEDUCTION",
                "sequence": 50,
                "computation_type": "FIXED",
                "fixed_amount": "360.00",
            },
            headers=admin_headers,
        )
        assert response.status_code == 201
        assert response.json()["category"] == "DEDUCTION"

    def test_create_python_expression_rule(self, client, admin_headers):
        """A PYTHON_EXPRESSION rule requires a formula string."""
        response = client.post(
            "/api/v1/salary-rules",
            json={
                "structure_id": self._structure(),
                "name": "Net Wage",
                "code": "NET",
                "category": "NET",
                "sequence": 100,
                "computation_type": "PYTHON_EXPRESSION",
                "formula": "BASIC + HRA + OT_PAY - PF - LEAVE_DED",
            },
            headers=admin_headers,
        )
        assert response.status_code == 201
        assert response.json()["formula"] == "BASIC + HRA + OT_PAY - PF - LEAVE_DED"

    def test_reject_fixed_rule_without_fixed_amount(self, client, admin_headers):
        """FIXED rule without fixed_amount should return 422 Unprocessable Entity."""
        response = client.post(
            "/api/v1/salary-rules",
            json={
                "structure_id": self._structure(),
                "name": "Bad Fixed Rule",
                "code": "BAD_FIXED",
                "category": "BASIC",
                "sequence": 5,
                "computation_type": "FIXED",
                # fixed_amount deliberately missing
            },
            headers=admin_headers,
        )
        assert response.status_code == 422
        assert "fixed_amount" in str(response.json())

    def test_reject_percentage_rule_without_percentage_value(self, client, admin_headers):
        """PERCENTAGE rule without percentage_value should return 422."""
        response = client.post(
            "/api/v1/salary-rules",
            json={
                "structure_id": self._structure(),
                "name": "Bad Percentage Rule",
                "code": "BAD_PCT",
                "category": "ALLOWANCE",
                "sequence": 5,
                "computation_type": "PERCENTAGE",
                # percentage_value deliberately missing
            },
            headers=admin_headers,
        )
        assert response.status_code == 422

    def test_reject_expression_rule_without_formula(self, client, admin_headers):
        """PYTHON_EXPRESSION rule without formula should return 422."""
        response = client.post(
            "/api/v1/salary-rules",
            json={
                "structure_id": self._structure(),
                "name": "Bad Expression Rule",
                "code": "BAD_EXPR",
                "category": "GROSS",
                "sequence": 5,
                "computation_type": "PYTHON_EXPRESSION",
                # formula deliberately missing
            },
            headers=admin_headers,
        )
        assert response.status_code == 422

    def test_reject_duplicate_rule_code_in_same_structure(self, client, admin_headers):
        """
        Rule codes are like variable names in payroll formulas.
        Two rules named 'BASIC' in the same structure = ambiguous formula → error.
        """
        # First creation should succeed
        client.post(
            "/api/v1/salary-rules",
            json={
                "structure_id": self._structure(),
                "name": "Another BASIC",
                "code": "UNIQUE_TEST",
                "category": "BASIC",
                "sequence": 1,
                "computation_type": "FIXED",
                "fixed_amount": "1000",
            },
            headers=admin_headers,
        )
        # Second creation with same code in same structure should fail
        response = client.post(
            "/api/v1/salary-rules",
            json={
                "structure_id": self._structure(),
                "name": "Duplicate BASIC",
                "code": "UNIQUE_TEST",  # Same code, same structure
                "category": "BASIC",
                "sequence": 2,
                "computation_type": "FIXED",
                "fixed_amount": "2000",
            },
            headers=admin_headers,
        )
        assert response.status_code == 400
        assert "UNIQUE_TEST" in response.json()["detail"]

    def test_reject_rule_for_nonexistent_structure(self, client, admin_headers):
        """Creating a rule for a structure that doesn't exist should return 404."""
        response = client.post(
            "/api/v1/salary-rules",
            json={
                "structure_id": 99999,  # Does not exist
                "name": "Orphan Rule",
                "code": "ORPHAN",
                "category": "BASIC",
                "sequence": 10,
                "computation_type": "FIXED",
                "fixed_amount": "1000",
            },
            headers=admin_headers,
        )
        assert response.status_code == 404

    def test_disabled_rule_is_represented_correctly(self, client, admin_headers):
        """A rule created with is_active=False should have is_active=False in the response."""
        response = client.post(
            "/api/v1/salary-rules",
            json={
                "structure_id": self._structure(),
                "name": "Disabled Bonus",
                "code": "BONUS_DISABLED",
                "category": "ALLOWANCE",
                "sequence": 99,
                "computation_type": "FIXED",
                "fixed_amount": "500",
                "is_active": False,
            },
            headers=admin_headers,
        )
        assert response.status_code == 201
        assert response.json()["is_active"] is False

    def test_rules_returned_in_sequence_order(self, client, admin_headers):
        """
        Rules must always come back sorted by sequence.
        This is critical for the payroll engine — it evaluates rules in order,
        and later rules reference results from earlier rules.
        """
        response = client.get(
            f"/api/v1/salary-rules?structure_id={self._structure()}",
            headers=admin_headers,
        )
        assert response.status_code == 200
        rules = response.json()

        sequences = [r["sequence"] for r in rules]
        assert sequences == sorted(sequences), (
            f"Rules are not in sequence order! Got: {sequences}"
        )

    def test_nested_route_creates_rule_for_structure(self, client, admin_headers):
        """The nested POST /salary-structures/{id}/rules route should also work."""
        structure_id = self._structure()
        response = client.post(
            f"/api/v1/salary-structures/{structure_id}/rules",
            json={
                "structure_id": 0,  # Should be overridden by URL param
                "name": "Nested Route Rule",
                "code": "NESTED_RULE",
                "category": "ALLOWANCE",
                "sequence": 98,
                "computation_type": "FIXED",
                "fixed_amount": "100",
            },
            headers=admin_headers,
        )
        assert response.status_code == 201
        assert response.json()["structure_id"] == structure_id
